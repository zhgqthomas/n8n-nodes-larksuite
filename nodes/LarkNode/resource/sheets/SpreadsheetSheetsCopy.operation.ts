import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const SpreadsheetSheetsAddOperate: ResourceOperations = {
	name: '复制工作表',
	value: 'spreadsheet:copySheets',
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
		{
			displayName: '源工作表的 ID',
			name: 'sheetId',
			type: 'string',
			required: true,
			default: '',
		},
		{
			displayName: '新工作表名称',
			name: 'title',
			type: 'string',
			default: '',
			required: true,
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const spreadsheetToken = this.getNodeParameter('spreadsheetToke', index) as string;
		const sheetId = this.getNodeParameter('sheetId', index) as IDataObject;
		const title = this.getNodeParameter('title', index) as IDataObject;

		const body: IDataObject = {
			requests: [
				{
					copySheet: {
						"source": {
							"sheetId": sheetId
						},
						"destination": {
							"title": title
						}
					},
				},
			],
		};

		return RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/sheets/v2/spreadsheets/${spreadsheetToken}/sheets_batch_update`,
			body,
		});
	},
};

export default SpreadsheetSheetsAddOperate;
