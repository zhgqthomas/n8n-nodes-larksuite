import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const WikiSpacesGetMembersOperate: ResourceOperations = {
	name: '获取知识空间成员列表',
	value: 'wiki:spaces:members:get',
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
			displayName: '每页大小',
			name: 'page_size',
			type: 'number',
			default: 20,
			description: '分页大小',
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
		const pageSize = this.getNodeParameter('page_size', index) as number;
		const pageToken = this.getNodeParameter('page_token', index) as string;

		const qs: IDataObject = {
			page_size: pageSize,
		};

		if (pageToken) {
			qs.page_token = pageToken;
		}

		return RequestUtils.request.call(this, {
			method: 'GET',
			url: `/open-apis/wiki/v2/spaces/${spaceId}/members`,
			qs,
		});
	},
};

export default WikiSpacesGetMembersOperate;
