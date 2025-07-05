import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { ResourceOperations } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';

export default {
	name: '查询主日历信息',
	value: 'calendar:getPrimaryCalendar',
	order: 100,
	options: [
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
		const userIdType = this.getNodeParameter('user_id_type', index, 'open_id') as string;

		const qs: IDataObject = {};

		if (userIdType) {
			qs.user_id_type = userIdType;
		}

		return RequestUtils.request.call(this, {
			method: 'POST',
			url: '/open-apis/calendar/v4/calendars/primary',
			qs,
		});
	},
} as ResourceOperations;
