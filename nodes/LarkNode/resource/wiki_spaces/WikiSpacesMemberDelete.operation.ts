import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const WikiSpacesDeleteMemberOperate: ResourceOperations = {
	name: '删除知识空间成员',
	value: 'wiki:spaces:members:delete',
	order: 97,
	options: [
		{
			displayName: '知识空间ID',
			name: 'space_id',
			type: 'string',
			required: true,
			default: '',
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
			displayName: '成员类型',
			name: 'member_type',
			type: 'options',
			required: true,
			// eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
			options: [
				{ name: '群ID', value: 'openchat' },
				{ name: '用户ID', value: 'userid' },
				{ name: '邮箱', value: 'email' },
				{ name: '部门ID', value: 'opendepartmentid' },
				{ name: 'Open ID', value: 'openid' },
				{ name: 'Union ID', value: 'unionid' },
			],
			default: 'openid',
			description: '要删除的成员或管理员身份类型',
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
			displayName: '协作者类型',
			name: 'type',
			type: 'options',
			options: [
				{ name: '用户', value: 'user' },
				{ name: '群组', value: 'chat' },
				{ name: '组织架构', value: 'department' },
			],
			default: 'user',
			description: '知识库协作者类型（暂不支持）',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const spaceId = this.getNodeParameter('space_id', index) as string;
		const memberId = this.getNodeParameter('member_id', index) as string;
		const memberType = this.getNodeParameter('member_type', index) as string;
		const memberRole = this.getNodeParameter('member_role', index) as string;
		const type = this.getNodeParameter('type', index) as string;

		const body: IDataObject = {
			member_type: memberType,
			member_role: memberRole,
		};

		if (type) {
			body.type = type;
		}

		return RequestUtils.request.call(this, {
			method: 'DELETE',
			url: `/open-apis/wiki/v2/spaces/${spaceId}/members/${memberId}`,
			body,
		});
	},
};

export default WikiSpacesDeleteMemberOperate;
