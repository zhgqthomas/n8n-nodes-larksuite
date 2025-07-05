import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const WikiSpacesNodeGetChildrenOperate: ResourceOperations = {
	name: '获取知识空间子节点列表',
	value: 'wiki:spaces:node:children',
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
			displayName: '父节点Token',
			name: 'parent_node_token',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
		{
			displayName: '每页大小',
			name: 'page_size',
			type: 'number',
			default: 20,
			description: '分页大小，最大值50',
		},
		{
			displayName: '分页标记',
			name: 'page_token',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: '分页标记，第一次请求不填',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const spaceId = this.getNodeParameter('space_id', index) as string;
		const parentNodeToken = this.getNodeParameter('parent_node_token', index) as string;
		const pageSize = this.getNodeParameter('page_size', index) as number;
		const pageToken = this.getNodeParameter('page_token', index) as string;

		const qs: IDataObject = {
			page_size: pageSize,
		};

		if (parentNodeToken) {
			qs.parent_node_token = parentNodeToken;
		}

		if (pageToken) {
			qs.page_token = pageToken;
		}

		return RequestUtils.request.call(this, {
			method: 'GET',
			url: `/open-apis/wiki/v2/spaces/${spaceId}/nodes`,
			qs,
		});
	},
};

export default WikiSpacesNodeGetChildrenOperate;
