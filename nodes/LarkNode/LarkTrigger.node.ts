import {
	INodeType,
	INodeTypeDescription,
	ITriggerFunctions,
	ITriggerResponse,
	NodeConnectionType,
	NodeOperationError,
} from 'n8n-workflow';
import * as Lark from '@larksuiteoapi/node-sdk';

export class LarkTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Lark Trigger',
		name: 'LarkTrigger',
		icon: 'file:lark_icon.svg',
		group: ['trigger'],
		version: 1,
		description: 'Triggers for Lark events',
		defaults: {
			name: 'Lark Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'larkCredentialsApi',
				required: true,
			},
		],
		properties: [
			{
				displayName:
					'Due to Lark API limitations, you can use just one Lark trigger for each bot at a time',
				name: 'LarkTriggerNotice',
				type: 'notice',
				default: '',
			},
			{
				displayName: 'Trigger On',
				name: 'updates',
				type: 'multiOptions',
				options: [
					{
						name: '*',
						value: '*',
						description: 'All updates',
					},
					{
						name: 'Callback Query',
						value: 'callback_query',
						description: 'Trigger on new incoming callback query',
					},
				],
				required: true,
				default: [],
			},
		],
	};

	async trigger(this: ITriggerFunctions): Promise<ITriggerResponse | undefined> {
		const credentials = await this.getCredentials('larkCredentialsApi');

		if (!credentials.appid || !credentials.appsecret) {
			throw new NodeOperationError(this.getNode(), 'Missing required Lark credentials');
		}
		const appId = credentials['appid'] as string;
		const appSecret = credentials['appsecret'] as string;
		const baseUrl = credentials['baseUrl'] as string;

		const client = new Lark.Client({ appId, appSecret });
		let wsClient: Lark.WSClient | null = new Lark.WSClient({
			appId,
			appSecret,
			domain: baseUrl === 'open.feishu.cn' ? Lark.Domain.Feishu : Lark.Domain.Lark,
			loggerLevel: Lark.LoggerLevel.debug,
		});

		// const eventMap: Record<string, (data: any) => Promise<void>> = {};
		// for (const eventType of eventTypes) {
		// 	eventMap[eventType] = async (data: any) => {
		// 		const item: INodeExecutionData = { json: data };
		// 		this.emit([item as INodeExecutionData]);
		// 	};
		// }

		const eventDispatcher = new Lark.EventDispatcher({}).register({
			'im.message.receive_v1': async (data) => {
				// console.log(`Received im.message.receive_v1 event: ${JSON.stringify(data)}`);
				const {
					message: { chat_id, content },
				} = data;
				// 示例操作：接收消息后，调用「发送消息」API 进行消息回复。
				await client.im.v1.message.create({
					params: {
						receive_id_type: 'chat_id',
					},
					data: {
						receive_id: chat_id,
						content: Lark.messageCard.defaultCard({
							title: `回复： ${JSON.parse(content).text}`,
							content: '新年好',
						}),
						msg_type: 'interactive',
					},
				});

				// this.emit([
				// 	this.helpers.returnJsonArray([
				// 		{
				// 			chat_id,
				// 			content: Lark.messageCard.defaultCard({
				// 				title: `回复： ${JSON.parse(content).text}`,
				// 				content: '新年好',
				// 			}),
				// 			msg_type: 'interactive',
				// 		},
				// 	]),
				// ]);
			},
		});

		const manualTriggerFunction = async () => {
			try {
				wsClient?.start({ eventDispatcher });
				this.logger.info('Started Lark app in test mode');
			} catch (error) {
				this.logger.error('Error starting Lark app in test mode: ' + error);
				throw error;
			}

			return new Promise<void>((resolve) => {
				resolve();
			});
		};

		if (this.getMode() === 'trigger') {
			try {
				wsClient?.start({ eventDispatcher });
				this.logger.info('Started Lark app in trigger mode');
			} catch (error) {
				this.logger.error('Error starting Lark app in trigger mode: ' + error);
				throw error;
			}
		}

		const closeFunction = async () => {
			try {
				wsClient = null; // Close the WebSocket connection
				this.logger.info('Lark app has been stopped');
			} catch (error) {
				this.logger.error('Error stopping Lark app: ' + error);
			}
		};
		return {
			closeFunction,
			manualTriggerFunction,
		};
	}
}
