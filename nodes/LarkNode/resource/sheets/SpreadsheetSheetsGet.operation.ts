import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const SpreadsheetSheetsGetOperate: ResourceOperations = {
	name: '获取工作表',
	value: 'spreadsheet:getSheets',
	order: 95,
	options: [
		{
			displayName: '电子表格 Token',
			name: 'spreadsheetToke',
			type: 'string',
			required: true,
			default: '',
			description: '电子表格的 token。',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const spreadsheetToken = this.getNodeParameter('spreadsheetToke', index) as string;

		return RequestUtils.request.call(this, {
			method: 'GET',
			url: `/open-apis/sheets/v3/spreadsheets/${spreadsheetToken}/sheets/query`,
		});
	},
};

export default SpreadsheetSheetsGetOperate;
