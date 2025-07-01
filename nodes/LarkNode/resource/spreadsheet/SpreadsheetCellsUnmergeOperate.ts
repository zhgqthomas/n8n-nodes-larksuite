import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const SpreadsheetCellsUnmergeOperate: ResourceOperations = {
	name: '拆分单元格',
	value: 'spreadsheet:unmergeCells',
	order: 80,
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
			displayName: '单元格范围',
			name: 'range',
			type: 'string',
			required: true,
			default: '',
			description: '要拆分的单元格的范围，格式为 &lt;sheetId&gt;!&lt;开始位置&gt;:&lt;结束位置&gt;。',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const spreadsheetToken = this.getNodeParameter('spreadsheetToke', index) as string;
		const range = this.getNodeParameter('range', index) as string;

		const body: IDataObject = {
			range,
		};

		return RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/sheets/v2/spreadsheets/${spreadsheetToken}/unmerge_cells`,
			body,
		});
	},
};

export default SpreadsheetCellsUnmergeOperate;
