import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { ResourceOperations } from '../../../help/type/IResource';
import NodeUtils from '../../../help/utils/NodeUtils';
import RequestUtils from '../../../help/utils/RequestUtils';

export default {
	name: '添加日程参与人',
	value: 'calendar:addEventAttendees',
	order: 80,
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
			description: '日程 ID。可通过创建日程、获取日程列表、搜索日程等接口获取',
		},
		{
			// eslint-disable-next-line n8n-nodes-base/node-param-display-name-miscased
			displayName: '参与人列表(attendees对象)',
			name: 'attendees',
			type: 'json',
			default: '[]',
			description: '新增参与人列表。参考：https://open.feishu.cn/document/server-docs/calendar-v4/calendar-event-attendee/create#requestBody',
		},
		{
			displayName: '是否发送通知',
			name: 'need_notification',
			type: 'boolean',
			default: true,
		},
		{
			displayName: '重复日程实例时间戳',
			name: 'instance_start_time_admin',
			type: 'string',
			default: '',
			description: '要修改的重复日程实例的时间戳。仅用于修改重复日程中的某一实例，非重复日程无需填写。',
		},
		{
			displayName: '启用会议室管理员身份',
			name: 'is_enable_admin',
			type: 'boolean',
			default: false,
		},
		{
			displayName: '添加操作人为参与人',
			name: 'add_operator_to_attendee',
			type: 'boolean',
			default: false,
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
		const attendees = NodeUtils.getNodeJsonData(this, "attendees", index) as IDataObject[];
		const needNotification = this.getNodeParameter('need_notification', index, true) as boolean;
		const instanceStartTimeAdmin = this.getNodeParameter('instance_start_time_admin', index, '') as string;
		const isEnableAdmin = this.getNodeParameter('is_enable_admin', index, false) as boolean;
		const addOperatorToAttendee = this.getNodeParameter('add_operator_to_attendee', index, false) as boolean;
		const userIdType = this.getNodeParameter('user_id_type', index, 'open_id') as string;

		const qs: IDataObject = {};

		if (userIdType) {
			qs.user_id_type = userIdType;
		}

		const body: IDataObject = {};

		if (attendees && attendees.length > 0) {
			body.attendees = attendees;
		}

		body.need_notification = needNotification;

		if (instanceStartTimeAdmin) {
			body.instance_start_time_admin = instanceStartTimeAdmin;
		}

		body.is_enable_admin = isEnableAdmin;
		body.add_operator_to_attendee = addOperatorToAttendee;

		return RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/calendar/v4/calendars/${calendarId}/events/${eventId}/attendees`,
			qs,
			body,
		});
	},
} as ResourceOperations;
