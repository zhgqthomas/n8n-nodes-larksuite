import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const WikiSpacesNodeMoveOperate: ResourceOperations = {
	name: '移动知识空间节点',
	value: 'wiki:spaces:node:move',
	order: 90,
	options: [
		{
			displayName: '源知识空间ID',
			name: 'space_id',
			type: 'string',
			required: true,
			default: '',
		},
		{
			displayName: '需要迁移的节点Token',
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
			description: '移动到的父节点token',
		},
		{
			displayName: '目标知识空间ID',
			name: 'target_space_id',
			type: 'string',
			default: '',
			description: '移动到的知识空间ID',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const spaceId = this.getNodeParameter('space_id', index) as string;
		const nodeToken = this.getNodeParameter('node_token', index) as string;
		const targetParentToken = this.getNodeParameter('target_parent_token', index) as string;
		const targetSpaceId = this.getNodeParameter('target_space_id', index) as string;

		const body: IDataObject = {};

		if (targetParentToken) {
			body.target_parent_token = targetParentToken;
		}
		if (targetSpaceId) {
			body.target_space_id = targetSpaceId;
		}

		return RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/wiki/v2/spaces/${spaceId}/nodes/${nodeToken}/move`,
			body,
		});
	},
};

export default WikiSpacesNodeMoveOperate;
