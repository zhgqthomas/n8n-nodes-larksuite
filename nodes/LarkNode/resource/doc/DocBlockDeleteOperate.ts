import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const DocBlockDeleteOperate: ResourceOperations = {
	name: '删除块',
	value: 'doc:block:delete',
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
			displayName: '父块 ID',
			name: 'block_id',
			type: 'string',
			default: '',
			required: true,
		},
		{
			displayName: '文档版本',
			name: 'document_revision_id',
			type: 'number',
			default: -1,
			description: '查询的文档版本，-1 表示文档最新版本。',
		},
		{
			displayName: '操作的唯一标识',
			name: 'client_toke',
			type: 'string',
			default: '',
			description: '操作的唯一标识，与接口返回值的 client_token 相对应，用于幂等的进行更新操作。此值为空表示将发起一次新的请求，此值非空表示幂等的进行更新操作',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const document_id = this.getNodeParameter('document_id', index) as string;
		const block_id = this.getNodeParameter('block_id', index) as string;
		const document_revision_id = this.getNodeParameter('document_revision_id', index, -1) as number;
		const client_toke = this.getNodeParameter('client_toke', index, '') as string;

		const qs = {
			document_revision_id,
			client_toke,
		};

		return RequestUtils.request.call(this, {
			method: 'DELETE',
			url: `/open-apis/docx/v1/documents/${document_id}/blocks/${block_id}/children/batch_delete`,
			qs,
		});
	},
};

export default DocBlockDeleteOperate;
