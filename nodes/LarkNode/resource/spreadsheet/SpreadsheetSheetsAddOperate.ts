import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const SpreadsheetSheetsAddOperate: ResourceOperations = {
	name: '新增工作表',
	value: 'spreadsheet:addSheets',
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
			displayName: '新增工作表的标题',
			name: 'title',
			type: 'string',
			required: true,
			default: '',
		},
		{
			displayName: '新增工作表的位置',
			name: 'index',
			type: 'number',
			default: 0,
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const spreadsheetToken = this.getNodeParameter('spreadsheetToke', index) as string;
		const title = this.getNodeParameter('title', index) as IDataObject;
		const _index = this.getNodeParameter('index', index) as IDataObject;

		const body: IDataObject = {
			requests: [
				{
					addSheet: {
						properties: {
							title: title,
							index: _index,
						},
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
