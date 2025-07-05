import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const SpreadsheetCellsFindOperate: ResourceOperations = {
	name: '查找单元格',
	value: 'spreadsheet:findCells',
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
			displayName: '工作表 ID',
			name: 'sheetId',
			type: 'string',
			required: true,
			default: '',
		},
		{
			displayName: '查找范围',
			name: 'range',
			type: 'string',
			required: true,
			default: '',
			description: '查找范围，格式为 &lt;sheetId&gt;!&lt;开始位置&gt;:&lt;结束位置&gt;。',
		},
		{
			displayName: '查找字符串',
			name: 'find',
			type: 'string',
			required: true,
			default: '',
			description: '查找的字符串。',
		},
		{
			displayName: '是否忽略查找字符串的大小写',
			name: 'matchCase',
			type: 'boolean',
			default: false,
		},
		{
			displayName: '字符串是否需要完全匹配整个单元格',
			name: 'matchEntireCell',
			type: 'boolean',
			default: false,
		},
		{
			displayName: '是否使用正则表达式查找',
			name: 'searchByRegex',
			type: 'boolean',
			default: false,
		},
		{
			displayName: '是否仅搜索单元格公式',
			name: 'includeFormulas',
			type: 'boolean',
			default: false,
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const spreadsheetToken = this.getNodeParameter('spreadsheetToke', index) as string;
		const sheetId = this.getNodeParameter('sheetId', index) as string;
		const range = this.getNodeParameter('range', index) as string;
		const find = this.getNodeParameter('find', index) as string;
		const matchCase = this.getNodeParameter('matchCase', index) as boolean;
		const matchEntireCell = this.getNodeParameter('matchEntireCell', index) as boolean;
		const searchByRegex = this.getNodeParameter('searchByRegex', index) as boolean;
		const includeFormulas = this.getNodeParameter('includeFormulas', index) as boolean;

		const body: IDataObject = {
			find_condition: {
				range,
				match_case: matchCase,
				match_entire_cell: matchEntireCell,
				search_by_regex: searchByRegex,
				include_formulas: includeFormulas,
			},
			find,
		};

		return RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/sheets/v3/spreadsheets/${spreadsheetToken}/sheets/${sheetId}/find`,
			body
		});
	},
};

export default SpreadsheetCellsFindOperate;
