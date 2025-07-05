import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const DocCreateOperate: ResourceOperations = {
	name: '创建文档',
	value: 'doc:create',
	options: [
		{
			displayName: '文档标题',
			name: 'title',
			type: 'string',
			default: '',
			description: '文档标题，只支持纯文本, 长度范围：1 字符 ～ 800 字符'
		},
		{
			displayName: '文件夹 Token',
			name: 'folder_toke',
			type: 'string',
			default: '',
			description: '指定文档所在文件夹的 Token。不传或传空表示根目录。',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const title = this.getNodeParameter('title', index) as string;
		const folder_token = this.getNodeParameter('folder_toke', index) as string;

		const body: IDataObject = {};
		if (title) {
			body.title = title;
		}
		if (folder_token) {
			body.folder_token = folder_token;
		}

		return RequestUtils.request.call(this, {
			method: 'POST',
			url: '/open-apis/docx/v1/documents',
			body,
		});
	},
};

export default DocCreateOperate;
