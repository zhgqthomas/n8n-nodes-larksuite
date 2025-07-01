import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const WikiSpacesAddMemberOperate: ResourceOperations = {
	name: '添加知识空间成员',
	value: 'wiki:spaces:members:add',
	order: 95,
	options: [
		{
			displayName: '知识空间ID',
			name: 'space_id',
			type: 'string',
			required: true,
			default: '',
		},
		{
			displayName: '成员类型',
			name: 'member_type',
			type: 'options',
			required: true,
			// eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
			options: [
				{ name: '群组ID', value: 'openchat' },
				{ name: '用户ID', value: 'userid' },
				{ name: '邮箱', value: 'email' },
				{ name: '部门ID', value: 'opendepartmentid' },
				{ name: 'Open ID', value: 'openid' },
				{ name: 'Union ID', value: 'unionid' },
			],
			default: 'openid',
			description: '要添加的成员或管理员的身份类型',
		},
		{
			displayName: '成员ID',
			name: 'member_id',
			type: 'string',
			required: true,
			default: '',
			description: '成员或管理员的ID，值的类型由成员类型参数决定',
		},
		{
			displayName: '角色',
			name: 'member_role',
			type: 'options',
			required: true,
			options: [
				{ name: '管理员', value: 'admin' },
				{ name: '成员', value: 'member' },
			],
			default: 'member',
			description: '成员的角色类型',
		},
		{
			displayName: '是否通知',
			name: 'need_notification',
			type: 'boolean',
			default: false,
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const spaceId = this.getNodeParameter('space_id', index) as string;
		const memberType = this.getNodeParameter('member_type', index) as string;
		const memberId = this.getNodeParameter('member_id', index) as string;
		const memberRole = this.getNodeParameter('member_role', index) as string;
		const needNotification = this.getNodeParameter('need_notification', index) as boolean;

		const body: IDataObject = {
			member_type: memberType,
			member_id: memberId,
			member_role: memberRole,
		};

		const qs: IDataObject = {};
		if (needNotification !== undefined) {
			qs.need_notification = needNotification;
		}

		return RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/wiki/v2/spaces/${spaceId}/members`,
			body,
			qs,
		});
	},
};

export default WikiSpacesAddMemberOperate;
