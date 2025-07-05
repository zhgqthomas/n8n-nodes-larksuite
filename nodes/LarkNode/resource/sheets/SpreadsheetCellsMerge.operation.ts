import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const SpreadsheetCellsMergeOperate: ResourceOperations = {
	name: '合并单元格',
	value: 'spreadsheet:mergeCells',
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
			description: '要合并的单元格的范围，格式为 &lt;sheetId&gt;!&lt;开始位置&gt;:&lt;结束位置&gt;。',
		},
		{
			displayName: '合并类型',
			name: 'mergeType',
			type: 'options',
			options: [
				{ name: '合并所有单元格', value: 'MERGE_ALL' },
				{ name: '按行合并', value: 'MERGE_ROWS' },
				{ name: '按列合并', value: 'MERGE_COLUMNS' },
			],
			required: true,
			default: 'MERGE_ALL',
			description: '指定合并单元格的方式。',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const spreadsheetToken = this.getNodeParameter('spreadsheetToke', index) as string;
		const range = this.getNodeParameter('range', index) as string;
		const mergeType = this.getNodeParameter('mergeType', index) as string;

		const body: IDataObject = {
			range,
			mergeType,
		};

		return RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/sheets/v2/spreadsheets/${spreadsheetToken}/merge_cells`,
			body,
		});
	},
};

export default SpreadsheetCellsMergeOperate;
