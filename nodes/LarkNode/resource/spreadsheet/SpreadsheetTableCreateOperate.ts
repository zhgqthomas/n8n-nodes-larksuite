import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const SpreadsheetTableCreateOperate: ResourceOperations = {
	name: '创建电子表格',
	value: 'spreadsheet:create',
	order: 100,
	options: [
		{
			displayName: '表格标题',
			name: 'title',
			type: 'string',
			default: '',
			description: '表格标题。',
		},
		{
			displayName: '文件夹 Token',
			name: 'folder_toke',
			type: 'string',
			default: ''
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
			url: '/open-apis/sheets/v3/spreadsheets',
			body,
		});
	},
};

export default SpreadsheetTableCreateOperate;
