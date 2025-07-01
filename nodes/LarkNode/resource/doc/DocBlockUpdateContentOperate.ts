import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';
import NodeUtils from "../../../help/utils/NodeUtils";

const DocBlockUpdateContentOperate: ResourceOperations = {
	name: '更新块的内容',
	value: 'doc:block:updateContent',
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
			description: '父块的block_id，表示为其创建一批子块。如果需要对文档树根节点创建子块，可将 document_id 填入此处。',
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

		{
			name: 'body',
			// eslint-disable-next-line n8n-nodes-base/node-param-display-name-not-first-position
			displayName: '请求体JSON',
			type: 'json',
			default: '{}',
			description: '参考：https://open.feishu.cn/document/server-docs/docs/docs/docx-v1/document-block/patch#1b8abd5d',
		}
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const document_id = this.getNodeParameter('document_id', index) as string;
		const block_id = this.getNodeParameter('block_id', index) as string;
		const document_revision_id = this.getNodeParameter('document_revision_id', index, -1) as number;
		const client_token = this.getNodeParameter('client_toke', index) as string;
		const user_id_type = this.getNodeParameter('user_id_type', index, 'open_id') as string;
		const body = NodeUtils.getNodeJsonData(this, 'body', index);

		const qs = {
			document_revision_id,
			client_token,
			user_id_type,
		}

		return RequestUtils.request.call(this, {
			method: 'PATCH',
			url: `/open-apis/docx/v1/documents/${document_id}/blocks/${block_id}`,
			qs,
			body,
		});
	},
};

export default DocBlockUpdateContentOperate;
