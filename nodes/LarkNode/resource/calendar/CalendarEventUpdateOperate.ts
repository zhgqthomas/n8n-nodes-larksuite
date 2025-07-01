import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { ResourceOperations } from '../../../help/type/IResource';
import NodeUtils from '../../../help/utils/NodeUtils';
import RequestUtils from '../../../help/utils/RequestUtils';

export default {
	name: '更新日程',
	value: 'calendar:updateEvent',
	order: 90,
	options: [
		{
			displayName: '日历 ID',
			name: 'calendar_id',
			type: 'string',
			required: true,
			default: '',
			description: '日程所在的日历 ID。可以通过查询主日历信息、查询日历列表、搜索日历等接口获取。',
		},
		{
			displayName: '日程 ID',
			name: 'event_id',
			type: 'string',
			required: true,
			default: '',
			description: '日程 ID。可通过创建日程、获取日程列表、搜索日程等接口获取。',
		},
		{
			displayName: '请求体',
			name: 'body',
			type: 'json',
			required: true,
			default: '{}',
			description: '参考：https://open.feishu.cn/document/server-docs/calendar-v4/calendar-event/patch#requestBody',
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
		const eventId = this.getNodeParameter('event_id', index) as string;
		const body = NodeUtils.getNodeJsonData(this, "body", index) as IDataObject;
		const userIdType = this.getNodeParameter('user_id_type', index, 'open_id') as string;

		const qs: IDataObject = {};
		if (userIdType) {
			qs.user_id_type = userIdType;
		}

		return RequestUtils.request.call(this, {
			method: 'PATCH',
			url: `/open-apis/calendar/v4/calendars/${calendarId}/events/${eventId}`,
			qs,
			body
		});
	},
} as ResourceOperations;
