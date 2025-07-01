import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const UserBatchGetIdOperate: ResourceOperations = {
	name: '通过手机号或邮箱获取用户 ID',
	value: 'user:batchGetId',
	options: [
		{
			displayName: '返回的用户ID类型',
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
		{
			displayName: '用户邮箱列表',
			name: 'emails',
			type: 'json',
			default: '[]',
			description: '要查询的用户邮箱，最多可传入 50 条。',
		},
		{
			displayName: '用户手机号列表',
			name: 'mobiles',
			type: 'json',
			default: '[]',
			description: '要查询的用户手机号，最多可传入 50 条。',
		},
		{
			displayName: '是否包含离职员工',
			name: 'include_resigned',
			type: 'boolean',
			default: false,
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const user_id_type = this.getNodeParameter('user_id_type', index) as string;
		const emails = this.getNodeParameter('emails', index, [], {
			ensureType: 'json',
		}) as [];
		const mobiles = this.getNodeParameter('mobiles', index, [], {
			ensureType: 'json',
		}) as [];
		const include_resigned = this.getNodeParameter('include_resigned', index) as boolean;

		const body: IDataObject = {};
		if (emails) {
			body.emails = emails;
		}
		if (mobiles) {
			body.mobiles = mobiles;
		}
		body.include_resigned = include_resigned;

		return RequestUtils.request.call(this, {
			method: 'POST',
			url: '/open-apis/contact/v3/users/batch_get_id',
			qs: {
				user_id_type,
			},
			body
		});
	},
};

export default UserBatchGetIdOperate;
