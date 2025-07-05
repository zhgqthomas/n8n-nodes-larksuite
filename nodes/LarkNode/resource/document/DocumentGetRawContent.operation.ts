import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const DocGetRawContentOperate: ResourceOperations = {
	name: '获取文档纯文本内容',
	value: 'doc:getRawContent',
	options: [
		{
			displayName: '文档 ID',
			name: 'document_id',
			type: 'string',
			required: true,
			default: '',
			description: '文档的唯一标识。',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const document_id = this.getNodeParameter('document_id', index) as string;

		return RequestUtils.request.call(this, {
			method: 'GET',
			url: `/open-apis/docx/v1/documents/${document_id}/raw_content`,
		});
	},
};

export default DocGetRawContentOperate;
