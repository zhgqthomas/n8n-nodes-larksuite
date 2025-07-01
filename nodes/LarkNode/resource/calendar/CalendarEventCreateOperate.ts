import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { ResourceOperations } from '../../../help/type/IResource';
import NodeUtils from '../../../help/utils/NodeUtils';
import RequestUtils from '../../../help/utils/RequestUtils';

export default {
	name: '创建日程',
	value: 'calendar:createEvent',
	order: 90,
	options: [
		{
			displayName: '日历 ID',
			name: 'calendar_id',
			type: 'string',
			required: true,
			default: '',
			description: '日历 ID。可以通过查询主日历信息、查询日历列表、搜索日历等接口获取。',
		},
		{
			displayName: '请求体',
			name: 'body',
			type: 'json',
			required: true,
			default: '{}',
			description: '参考：https://open.feishu.cn/document/server-docs/calendar-v4/calendar-event/create#requestBody',
		},
		{
			displayName: '幂等 Key',
			name: 'idempotency_key',
			type: 'string',
			default: '',
			description: '创建日程的幂等 key，该 key 在应用和日历维度下唯一，用于避免重复创建资源。',
		},
		{
			displayName: '用户 ID 类型',
			name: 'user_id_type',
			type: 'options',
			options: [
				{ name: 'Open ID', value: 'open_id' },
				{ name: 'Union ID', value: 'union_id' },
				{ name: 'User ID', value: 'user_id' },
			],
			description: '用户 ID 类型。',
			default: 'open_id',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const calendarId = this.getNodeParameter('calendar_id', index) as string;
		const body = NodeUtils.getNodeJsonData(this, "body", index) as IDataObject;
		const idempotencyKey = this.getNodeParameter('idempotency_key', index, '') as string;
		const userIdType = this.getNodeParameter('user_id_type', index, 'open_id') as string;


		const qs: IDataObject = {};
		if (idempotencyKey) {
			qs.idempotency_key = idempotencyKey;
		}
		if (userIdType) {
			qs.user_id_type = userIdType;
		}

		return RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/calendar/v4/calendars/${calendarId}/events`,
			qs,
			body
		});
	},
} as ResourceOperations;
