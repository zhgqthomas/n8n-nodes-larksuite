import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { ResourceOperations } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';

export default {
	name: '删除日程',
	value: 'calendar:deleteEvent',
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
			displayName: '是否发送通知',
			name: 'need_notification',
			type: 'boolean',
			default: true,
			// eslint-disable-next-line n8n-nodes-base/node-param-description-boolean-without-whether
			description: '删除日程是否给日程参与人发送 Bot 通知。',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const calendarId = this.getNodeParameter('calendar_id', index) as string;
		const eventId = this.getNodeParameter('event_id', index) as string;
		const needNotification = this.getNodeParameter('need_notification', index, true) as boolean;

		const qs: IDataObject = {};
		if (needNotification !== undefined) {
			qs.need_notification = needNotification.toString();
		}

		return RequestUtils.request.call(this, {
			method: 'DELETE',
			url: `/open-apis/calendar/v4/calendars/${calendarId}/events/${eventId}`,
			qs,
		});
	},
} as ResourceOperations;
