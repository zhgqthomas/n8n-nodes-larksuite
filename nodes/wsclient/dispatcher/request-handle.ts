import { Logger } from 'n8n-workflow';

export default class RequestHandle {
	logger: Logger;

	constructor(params: { logger: Logger }) {
		this.logger = params.logger;
	}

	parse(data: any) {
		const targetData = data;

		// v1和v2版事件的区别：https://open.feishu.cn/document/ukTMukTMukTM/uUTNz4SN1MjL1UzM
		if ('schema' in targetData) {
			const { header, event, ...rest } = targetData;
			return {
				...rest,
				...header,
				...event,
			};
		}
		const { event, ...rest } = targetData;
		return {
			...event,
			...rest,
		};
	}
}
