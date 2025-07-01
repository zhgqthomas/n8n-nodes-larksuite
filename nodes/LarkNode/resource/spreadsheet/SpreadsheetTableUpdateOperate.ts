import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const SpreadsheetTableUpdateOperate: ResourceOperations = {
	name: '修改电子表格属性',
	value: 'spreadsheet:update',
	order: 100,
	options: [
		{
			displayName: '电子表格 Token',
			name: 'spreadsheet_toke',
			type: 'string',
			required: true,
			default: '',
			description: '电子表格的 token。',
		},
		{
			displayName: '新的电子表格标题',
			name: 'title',
			type: 'string',
			default: '',
			description: '新的电子表格标题。',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const spreadsheet_token = this.getNodeParameter('spreadsheet_toke', index) as string;
		const title = this.getNodeParameter('title', index) as string;

		const body: IDataObject = {};
		if (title) {
			body.title = title;
		}

		return RequestUtils.request.call(this, {
			method: 'PATCH',
			url: `/open-apis/sheets/v3/spreadsheets/${spreadsheet_token}`,
			body,
		});
	},
};

export default SpreadsheetTableUpdateOperate;
