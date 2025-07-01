import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { ResourceOperations } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';

export default {
	name: '获取日程',
	value: 'calendar:getEvent',
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
			displayName: '是否需要返回飞书视频会议（VC）的会前设置',
			name: 'need_meeting_settings',
			type: 'boolean',
			default: false,
		},
		{
			displayName: '是否需要返回参与人信息',
			name: 'need_attendee',
			type: 'boolean',
			default: false,
		},
		{
			displayName: '返回的最大参与人数量',
			name: 'max_attendee_num',
			type: 'number',
			default: 10,
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
		const needMeetingSettings = this.getNodeParameter('need_meeting_settings', index, false) as boolean;
		const needAttendee = this.getNodeParameter('need_attendee', index, false) as boolean;
		const maxAttendeeNum = this.getNodeParameter('max_attendee_num', index, 10) as number;
		const userIdType = this.getNodeParameter('user_id_type', index, 'open_id') as string;

		const qs: IDataObject = {
			need_meeting_settings: needMeetingSettings,
			need_attendee: needAttendee,
			max_attendee_num: maxAttendeeNum,
			user_id_type: userIdType,
		};

		return RequestUtils.request.call(this, {
			method: 'GET',
			url: `/open-apis/calendar/v4/calendars/${calendarId}/events/${eventId}`,
			qs,
		});
	},
} as ResourceOperations;
