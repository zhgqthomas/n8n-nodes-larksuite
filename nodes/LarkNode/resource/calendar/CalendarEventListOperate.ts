/* eslint-disable n8n-nodes-base/node-param-type-options-password-missing */
import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { ResourceOperations } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';

export default {
	name: '获取日程列表',
	value: 'calendar:listEvents',
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
			displayName: '每页数量',
			name: 'page_size',
			type: 'number',
			default: 500,
			description: '一次请求要求返回的最大日程数量。取值范围：50 ~ 1000',
		},
		{
			displayName: '分页标记',
			name: 'page_token',
			type: 'string',
			default: '',
			description: '分页标记，第一次请求不填，分页查询结果还有更多项时会返回新的 page_token。',
		},
		{
			displayName: '时间锚点',
			name: 'anchor_time',
			type: 'string',
			default: '',
			description: '时间锚点，Unix 时间戳（秒）。用于设置一个时间点，以便直接拉取该时间点之后的日程数据。',
		},
		{
			displayName: '增量同步标记',
			name: 'sync_token',
			type: 'string',
			default: '',
			description: '增量同步标记，第一次请求不填。当分页查询结束时返回，下次调用可用于增量获取变更数据。',
		},
		{
			displayName: '开始时间',
			name: 'start_time',
			type: 'string',
			default: '',
			description: '时间区间的开始时间，Unix 时间戳（秒），与结束时间搭配使用。',
		},
		{
			displayName: '结束时间',
			name: 'end_time',
			type: 'string',
			default: '',
			description: '时间区间的结束时间，Unix 时间戳（秒），与开始时间搭配使用。',
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
		const pageSize = this.getNodeParameter('page_size', index, 500) as number;
		const anchorTime = this.getNodeParameter('anchor_time', index, '') as string;
		const pageToken = this.getNodeParameter('page_token', index, '') as string;
		const syncToken = this.getNodeParameter('sync_token', index, '') as string;
		const startTime = this.getNodeParameter('start_time', index, '') as string;
		const endTime = this.getNodeParameter('end_time', index, '') as string;
		const userIdType = this.getNodeParameter('user_id_type', index, 'open_id') as string;

		const qs: IDataObject = {
			page_size: pageSize,
			user_id_type: userIdType,
		};

		if (anchorTime) {
			qs.anchor_time = anchorTime;
		}

		if (pageToken) {
			qs.page_token = pageToken;
		}

		if (syncToken) {
			qs.sync_token = syncToken;
		}

		if (startTime) {
			qs.start_time = startTime;
		}

		if (endTime) {
			qs.end_time = endTime;
		}

		return RequestUtils.request.call(this, {
			method: 'GET',
			url: `/open-apis/calendar/v4/calendars/${calendarId}/events`,
			qs,
		});
	},
} as ResourceOperations;
