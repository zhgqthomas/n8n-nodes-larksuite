import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const WikiSpacesNodeUpdateTitleOperate: ResourceOperations = {
	name: '更新知识空间节点标题',
	value: 'wiki:spaces:node:updateTitle',
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
			displayName: '新标题',
			name: 'title',
			type: 'string',
			required: true,
			default: '',
			description: '节点新标题',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const spaceId = this.getNodeParameter('space_id', index) as string;
		const nodeToken = this.getNodeParameter('node_token', index) as string;
		const title = this.getNodeParameter('title', index) as string;

		const body: IDataObject = {
			title,
		};

		return RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/wiki/v2/spaces/${spaceId}/nodes/${nodeToken}/update_title`,
			body,
		});
	},
};

export default WikiSpacesNodeUpdateTitleOperate;
