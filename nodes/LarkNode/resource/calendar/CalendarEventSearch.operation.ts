import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { ResourceOperations } from '../../../help/type/IResource';
import NodeUtils from '../../../help/utils/NodeUtils';
import RequestUtils from '../../../help/utils/RequestUtils';

export default {
	name: '搜索日程',
	value: 'calendar:searchEvents',
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
			displayName: '搜索关键字',
			name: 'query',
			type: 'string',
			required: true,
			default: '',
			description: '搜索关键字，用于模糊查询日程名称。如果日程名称包含下划线(_)，则必须精准查询。',
		},
		{
			// eslint-disable-next-line n8n-nodes-base/node-param-display-name-miscased
			displayName: '搜索过滤器(filter对象)',
			name: 'filter',
			type: 'json',
			default: '{}',
			description: '参考 https://open.feishu.cn/document/server-docs/calendar-v4/calendar-event/search#requestBody',
		},
		{
			displayName: '分页标记',
			name: 'page_token',
			// eslint-disable-next-line n8n-nodes-base/node-param-type-options-password-missing
			type: 'string',
			default: '',
			description: '分页标记，第一次请求不填，分页查询结果还有更多项时会返回新的 page_token。',
		},
		{
			displayName: '每页数量',
			name: 'page_size',
			type: 'number',
			default: 20,
			description: '一次调用所返回的最大日程数量。最小值为10，最大值为100。',
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
		const query = this.getNodeParameter('query', index) as string;
		const filter = NodeUtils.getNodeJsonData(this, "filter", index) as IDataObject;
		const pageToken = this.getNodeParameter('page_token', index, '') as string;
		const pageSize = this.getNodeParameter('page_size', index, 20) as number;
		const userIdType = this.getNodeParameter('user_id_type', index, 'open_id') as string;

		const qs: IDataObject = {};

		if (pageToken) {
			qs.page_token = pageToken;
		}

		if (pageSize) {
			qs.page_size = pageSize;
		}

		if (userIdType) {
			qs.user_id_type = userIdType;
		}

		const body: IDataObject = {
			query,
		};

		if (Object.keys(filter).length > 0) {
			body.filter = filter;
		}

		return RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/calendar/v4/calendars/${calendarId}/events/search`,
			qs,
			body,
		});
	},
} as ResourceOperations;
