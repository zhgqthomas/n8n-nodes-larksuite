import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const WikiSpacesNodeCopyOperate: ResourceOperations = {
	name: '创建知识空间节点副本',
	value: 'wiki:spaces:node:copy',
	order: 90,
	options: [
		{
			displayName: '知识空间ID',
			name: 'space_id',
			type: 'string',
			required: true,
			default: '',
		},
		{
			displayName: '节点Token',
			name: 'node_token',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
		},
		{
			displayName: '目标父节点Token',
			name: 'target_parent_token',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: '目标父节点Token，与目标知识空间ID不可同时为空',
		},
		{
			displayName: '目标知识空间ID',
			name: 'target_space_id',
			type: 'string',
			default: '',
			description: '目标知识空间ID，与目标父节点Token不可同时为空',
		},
		{
			displayName: '新标题',
			name: 'title',
			type: 'string',
			default: '',
			description: '复制后的新标题。如果填空，则新标题为空。如果不填，则使用原节点标题',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const spaceId = this.getNodeParameter('space_id', index) as string;
		const nodeToken = this.getNodeParameter('node_token', index) as string;
		const targetParentToken = this.getNodeParameter('target_parent_token', index) as string;
		const targetSpaceId = this.getNodeParameter('target_space_id', index) as string;
		const title = this.getNodeParameter('title', index) as string;

		const body: IDataObject = {};

		if (targetParentToken) {
			body.target_parent_token = targetParentToken;
		}
		if (targetSpaceId) {
			body.target_space_id = targetSpaceId;
		}
		if (title !== undefined) {
			body.title = title;
		}

		return RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/wiki/v2/spaces/${spaceId}/nodes/${nodeToken}/copy`,
			body,
		});
	},
};

export default WikiSpacesNodeCopyOperate;
