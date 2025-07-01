import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const DocGetAllBlocksOperate: ResourceOperations = {
	name: '获取文档所有块',
	value: 'doc:getAllBlocks',
	options: [
		{
			displayName: '文档 ID',
			name: 'document_id',
			type: 'string',
			required: true,
			default: '',
			description: '文档的唯一标识。',
		},
		{
			displayName: '分页大小',
			name: 'page_size',
			type: 'number',
			default: 500,
			description: '分页大小，最大值为500。',
		},
		{
			displayName: '分页标记',
			name: 'page_toke',
			type: 'string',
			default: '',
			description: '第一次请求不填，表示从头开始遍历；分页查询结果还有更多项时会同时返回新的 page_token，下次遍历可采用该 page_token 获取查询结果',
		},
		{
			displayName: '文档版本',
			name: 'document_revision_id',
			type: 'number',
			default: -1,
			description: '查询的文档版本，-1 表示文档最新版本。',
		},
		{
			displayName: '用户 ID 类型',
			name: 'user_id_type',
			type: 'options',
			default: 'open_id',
			options: [
				{
					name: 'Open_id',
					value: 'open_id',
				},
				{
					name: 'Union_id',
					value: 'union_id',
				},
				{
					name: 'User_id',
					value: 'user_id',
				},
			],
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const document_id = this.getNodeParameter('document_id', index) as string;
		const page_size = this.getNodeParameter('page_size', index, 500) as number;
		const page_token = this.getNodeParameter('page_toke', index, '') as string;
		const document_revision_id = this.getNodeParameter('document_revision_id', index, -1) as number;
		const user_id_type = this.getNodeParameter('user_id_type', index, 'open_id') as string;

		return RequestUtils.request.call(this, {
			method: 'GET',
			url: `/open-apis/docx/v1/documents/${document_id}/blocks`,
			qs: {
				page_size,
				page_token,
				document_revision_id,
				user_id_type,
			},
		});
	},
};

export default DocGetAllBlocksOperate;
