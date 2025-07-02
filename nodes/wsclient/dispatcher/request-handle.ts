import { Logger } from 'n8n-workflow';

const CEventType = Symbol('event-type');

export default class RequestHandle {
	logger: Logger;

	constructor(params: { logger: Logger }) {
		this.logger = params.logger;
	}

	parse(data: any) {
		const targetData = (() => {
			const { ...rest } = data || {};
			return rest;
		})();

		// v1和v2版事件的区别：https://open.feishu.cn/document/ukTMukTMukTM/uUTNz4SN1MjL1UzM
		if ('schema' in targetData) {
			const { header, event, ...rest } = targetData;
			return {
				[CEventType]: targetData?.header?.event_type,
				...rest,
				...header,
				...event,
			};
		}
		const { event, ...rest } = targetData;
		return {
			[CEventType]: targetData?.event?.type,
			...event,
			...rest,
		};
	}
}
