import { Logger, RequestHelperFunctions } from 'n8n-workflow';

import WebSocket from 'ws';
import { EventDispatcher } from './dispatcher';
import * as protoBuf from './proto-buf';
import { WSConfig } from './ws-config';
import { DataCache } from './data-cache';
import { Domain, ErrorCode, FrameType, HeaderKey, HttpStatusCode, MessageType } from './enum';
import { pbbp2 } from './proto-buf/pbbp2';

interface IConstructorParams {
	appId: string;
	appSecret: string;
	domain?: string | Domain;
	logger: Logger;
	helpers: RequestHelperFunctions;
	autoReconnect?: boolean;
	agent?: any;
}

export class WSClient {
	private wsConfig = new WSConfig();

	private logger: Logger;

	private dataCache: DataCache;

	private helpers: RequestHelperFunctions;

	private eventDispatcher?: EventDispatcher;

	private pingInterval?: NodeJS.Timeout;

	private reconnectInterval?: NodeJS.Timeout;

	private isConnecting: boolean = false;

	private reconnectInfo = {
		lastConnectTime: 0,
		nextConnectTime: 0,
	};

	private agent?: any;

	constructor(params: IConstructorParams) {
		const { appId, appSecret, logger, helpers, agent, domain, autoReconnect = true } = params;

		this.logger = logger;
		this.agent = agent;
		this.dataCache = new DataCache({ logger: this.logger });
		this.helpers = helpers;
		this.wsConfig.updateClient({
			appId,
			appSecret,
			domain,
		});

		this.wsConfig.updateWs({
			autoReconnect,
		});
	}

	private async pullConnectConfig() {
		const { appId, appSecret } = this.wsConfig.getClient();

		try {
			const response = await this.helpers.request({
				method: 'POST',
				url: this.wsConfig.wsConfigUrl,
				body: {
					AppID: appId,
					AppSecret: appSecret,
				},
				// consumed by gateway
				headers: {
					locale: 'zh',
				},
				timeout: 15000,
			});

			const {
				code,
				data: { URL: connectUrl, ClientConfig },
				msg,
			} = JSON.parse(response);

			if (code !== ErrorCode.ok) {
				this.logger.error(
					`[ws] code: ${code}, ${code === ErrorCode.system_busy ? msg : 'system busy'}`,
				);
				if (code === ErrorCode.system_busy || code === ErrorCode.internal_error) {
					return false;
				}
			}

			const parsedUrl = new URL(connectUrl);
			const device_id = parsedUrl.searchParams.get('device_id');
			const service_id = parsedUrl.searchParams.get('service_id');

			this.wsConfig.updateWs({
				connectUrl,

				deviceId: device_id as string,
				serviceId: service_id as string,

				pingInterval: ClientConfig.PingInterval * 1000,
				reconnectCount: ClientConfig.ReconnectCount,
				reconnectInterval: ClientConfig.ReconnectInterval * 1000,
				reconnectNonce: ClientConfig.ReconnectNonce * 1000,
			});

			this.logger.debug(`[ws] get connect config success, ws url: ${connectUrl}`);

			return true;
		} catch (e) {
			this.logger.error('[ws]', (e as any)?.message || 'system busy');
			return false;
		}
	}

	private connect() {
		const connectUrl = this.wsConfig.getWS('connectUrl');

		let wsInstance;

		try {
			const { agent } = this;
			wsInstance = new WebSocket(connectUrl, { agent });
		} catch (e) {
			this.logger.error('[ws] new WebSocket error');
		}

		if (!wsInstance) {
			return Promise.resolve(false);
		}

		return new Promise((resolve) => {
			wsInstance.on('open', () => {
				this.logger.debug('[ws] ws connect success');
				this.wsConfig.setWSInstance(wsInstance);
				this.pingLoop();
				resolve(true);
			});
			wsInstance.on('error', () => {
				this.logger.error('[ws] ws connect failed');
				resolve(false);
			});
		});
	}

	private async reConnect(isStart: boolean = false) {
		if (this.isConnecting) {
			this.logger.debug('[ws] repeat connection');
			return;
		}

		this.isConnecting = true;

		const tryConnect = () => {
			this.reconnectInfo.lastConnectTime = Date.now();
			return this.pullConnectConfig()
				.then((isSuccess) => (isSuccess ? this.connect() : Promise.resolve(false)))
				.then((isSuccess) => {
					if (isSuccess) {
						this.communicate();
						return Promise.resolve(true);
					}
					return Promise.resolve(false);
				});
		};

		if (this.pingInterval) {
			clearTimeout(this.pingInterval);
		}

		const wsInstance = this.wsConfig.getWSInstance();

		if (isStart) {
			if (wsInstance) {
				wsInstance?.terminate();
			}
			if (this.reconnectInterval) {
				clearTimeout(this.reconnectInterval);
			}
			let isSuccess = false;
			try {
				isSuccess = await tryConnect();
			} finally {
				this.isConnecting = false;
			}
			if (!isSuccess) {
				this.logger.error('[ws] connect failed');
				await this.reConnect();
			}
			this.logger.info('[ws] ws client ready');
			return;
		}

		const { autoReconnect, reconnectNonce, reconnectCount, reconnectInterval } =
			this.wsConfig.getWS();

		if (!autoReconnect) {
			return;
		}

		this.logger.info('[ws] reconnect');

		if (wsInstance) {
			wsInstance?.terminate();
		}

		this.wsConfig.setWSInstance(null);

		const reconnectNonceTime = reconnectNonce ? reconnectNonce * Math.random() : 0;
		this.reconnectInterval = setTimeout(async () => {
			(async function loopReConnect(this: WSClient, count: number) {
				count++;
				const isSuccess = await tryConnect();
				// if reconnectCount < 0, the reconnect time is infinite
				if (isSuccess) {
					this.logger.debug('[ws] reconnect success');
					this.isConnecting = false;
					return;
				}

				this.logger.info(`[ws] unable to connect to the server after trying ${count} times`);

				if (reconnectCount >= 0 && count >= reconnectCount) {
					this.isConnecting = false;
					return;
				}

				this.reconnectInterval = setTimeout(() => {
					loopReConnect.bind(this)(count);
				}, reconnectInterval);
				this.reconnectInfo.nextConnectTime = Date.now() + reconnectInterval;
			}).bind(this)(0);
		}, reconnectNonceTime);
		this.reconnectInfo.nextConnectTime = Date.now() + reconnectNonceTime;
	}

	private pingLoop() {
		const { serviceId, pingInterval } = this.wsConfig.getWS();

		const wsInstance = this.wsConfig.getWSInstance();
		if (wsInstance?.readyState === WebSocket.OPEN) {
			const frame: pbbp2.IFrame = {
				headers: [
					{
						key: HeaderKey.type,
						value: MessageType.ping,
					},
				],
				service: Number(serviceId),
				method: FrameType.control,
				SeqID: 0,
				LogID: 0,
			};
			this.sendMessage(frame);
			this.logger.info('[ws] ping success');
		}

		this.pingInterval = setTimeout(this.pingLoop.bind(this), pingInterval);
	}

	private communicate() {
		const wsInstance = this.wsConfig.getWSInstance();

		wsInstance?.on('message', async (buffer: Uint8Array) => {
			const data = protoBuf.decode(buffer);
			const { method } = data;

			if (method === FrameType.control) {
				await this.handleControlData(data);
			}

			if (method === FrameType.data) {
				await this.handleEventData(data);
			}
		});

		wsInstance?.on('error', (e) => {
			this.logger.error('[ws] ws error');
		});

		wsInstance?.on('close', () => {
			this.logger.info('[ws] client closed');
		});
	}

	private async handleControlData(data: pbbp2.Frame) {
		const type = data.headers.find((item) => item.key === HeaderKey.type)?.value;
		const payload = data.payload;

		if (type === MessageType.ping) {
			return;
		}

		if (type === MessageType.pong && payload) {
			this.logger.info('[ws] receive pong');
			const dataString = new TextDecoder('utf-8').decode(payload);
			const { PingInterval, ReconnectCount, ReconnectInterval, ReconnectNonce } =
				JSON.parse(dataString);

			this.wsConfig.updateWs({
				pingInterval: PingInterval * 1000,
				reconnectCount: ReconnectCount,
				reconnectInterval: ReconnectInterval * 1000,
				reconnectNonce: ReconnectNonce * 1000,
			});

			this.logger.info('[ws] update wsConfig with pong data');
		}
	}

	private async handleEventData(data: pbbp2.Frame) {
		const headers = data.headers.reduce(
			(acc, cur) => {
				acc[cur.key as HeaderKey] = cur.value;
				return acc;
			},
			{} as Record<HeaderKey, string>,
		);
		const { message_id, sum, seq, type, trace_id } = headers;
		const payload = data.payload;

		if (type !== MessageType.event) {
			return;
		}

		const mergedData = this.dataCache.mergeData({
			message_id,
			sum: Number(sum),
			seq: Number(seq),
			trace_id,
			data: payload,
		});

		if (!mergedData) {
			return;
		}

		this.logger.debug(
			`[ws] receive message, message_type: ${type}; message_id: ${message_id}; trace_id: ${trace_id}; data: ${mergedData.data}`,
		);

		const respPayload: { code: number; data?: string } = {
			code: HttpStatusCode.ok,
		};

		const startTime = Date.now();
		try {
			const result = await this.eventDispatcher?.invoke(mergedData);
			if (result) {
				respPayload.data = Buffer.from(JSON.stringify(result)).toString('base64');
			}
		} catch (error) {
			respPayload.code = HttpStatusCode.internal_server_error;
			this.logger.error(
				`[ws] invoke event failed, message_type: ${type}; message_id: ${message_id}; trace_id: ${trace_id}; error: ${error}`,
			);
		}
		const endTime = Date.now();

		this.sendMessage({
			...data,
			headers: [...data.headers, { key: HeaderKey.biz_rt, value: String(startTime - endTime) }],
			payload: new TextEncoder().encode(JSON.stringify(respPayload)),
		});
	}

	private sendMessage(data: pbbp2.IFrame) {
		const wsInstance = this.wsConfig.getWSInstance();
		if (wsInstance?.readyState === WebSocket.OPEN) {
			const resp = pbbp2.Frame.encode(data).finish();
			this.wsConfig.getWSInstance()?.send(resp, (err) => {
				if (err) {
					this.logger.error('[ws] send data failed');
				}
			});
		}
	}

	getReconnectInfo() {
		return this.reconnectInfo;
	}

	async start(params: { eventDispatcher: EventDispatcher }) {
		const { eventDispatcher } = params;

		if (!eventDispatcher) {
			this.logger.error('[ws] client need to start with a eventDispatcher');
			return;
		}
		this.eventDispatcher = eventDispatcher;
		this.reConnect(true);
	}

	async stop() {
		const wsInstance = this.wsConfig.getWSInstance();

		if (wsInstance) {
			wsInstance.terminate();
		}

		if (this.reconnectInterval) {
			clearTimeout(this.reconnectInterval);
		}

		if (this.pingInterval) {
			clearTimeout(this.pingInterval);
		}

		this.dataCache.clear();
		this.eventDispatcher = undefined;
		this.isConnecting = false;
	}
}
