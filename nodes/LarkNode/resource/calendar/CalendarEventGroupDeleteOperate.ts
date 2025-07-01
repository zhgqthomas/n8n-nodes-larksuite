import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { ResourceOperations } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';

export default {
	name: '解绑会议群',
	value: 'calendar:unbindEventMeetingChat',
	order: 70,
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
			displayName: '会议群 ID',
			name: 'meeting_chat_id',
			type: 'string',
			required: true,
			default: '',
			description: '会议群 ID。在创建会议群时会返回会议群 ID。',
		}
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const calendarId = this.getNodeParameter('calendar_id', index) as string;
		const eventId = this.getNodeParameter('event_id', index) as string;
		const meetingChatId = this.getNodeParameter('meeting_chat_id', index) as string;

		const qs: IDataObject = {};

		if (meetingChatId) {
			qs.meeting_chat_id = meetingChatId;
		}

		return RequestUtils.request.call(this, {
			method: 'DELETE',
			url: `/open-apis/calendar/v4/calendars/${calendarId}/events/${eventId}/meeting_chat`,
			qs,
		});
	},
} as ResourceOperations;
