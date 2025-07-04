import { Logger } from 'n8n-workflow';

import { internalCache } from './cache';
import { Cache } from '../types';
import { IHandles } from './events-template';
import RequestHandle from './request-handle';

const CAppTicketHandle = 'app_ticket';
const CAppTicket = Symbol('app-ticket');

export class EventDispatcher {
	requestHandle?: RequestHandle;

	handles: Map<string, Function> = new Map();

	cache: Cache;

	logger: Logger;

	constructor(params: { logger: Logger }) {
		this.logger = params.logger;

		this.requestHandle = new RequestHandle({
			logger: this.logger,
		});

		this.cache = internalCache;

		this.registerAppTicketHandle();

		this.logger.info('event-dispatch is ready');
	}

	private registerAppTicketHandle() {
		this.register({
			app_ticket: async (data: any) => {
				const { app_ticket, app_id } = data;

				if (app_ticket) {
					await this.cache.set(CAppTicket, app_ticket, undefined, {
						namespace: app_id,
					});
					this.logger.debug('set app ticket');
				} else {
					this.logger.warn('response not include app ticket');
				}
			},
		});
	}

	register<T = {}>(handles: IHandles & T) {
		Object.keys(handles).forEach((key) => {
			if (this.handles.has(key) && key !== CAppTicketHandle) {
				this.logger.error(`this ${key} handle is registered`);
			}

			const handle = handles[key as keyof IHandles];
			if (handle) {
				this.handles.set(key, handle);
			} else {
				this.logger.warn(`Handle for key ${key} is undefined and will not be registered`);
			}
			this.logger.debug(`register ${key} handle`);
		});

		return this;
	}

	async invoke(data: any) {
		const targetData = this.requestHandle?.parse(data);
		this.logger.debug(`Event data: ${JSON.stringify(targetData)}`);

		const type = targetData['event_type'];
		if (this.handles.has(type)) {
			const ret = await this.handles.get(type)!(targetData);
			this.logger.debug(`execute ${type} handle`);
			return ret;
		}

		this.logger.warn(`no ${type} handle`);

		return `no ${type} event handle`;
	}
}
