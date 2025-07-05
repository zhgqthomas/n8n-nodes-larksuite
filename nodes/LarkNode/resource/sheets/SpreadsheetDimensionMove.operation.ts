import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const SpreadsheetDimensionMoveOperate: ResourceOperations = {
	name: '移动行列',
	value: 'spreadsheet:moveDimension',
	order: 90,
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
			displayName: '工作表 ID',
			name: 'sheet_id',
			type: 'string',
			required: true,
			default: '',
			description: '工作表的 ID。',
		},
		{
			displayName: '移动的维度',
			name: 'major_dimension',
			type: 'options',
			options: [
				{ name: '行', value: 'ROWS' },
				{ name: '列', value: 'COLUMNS' },
			],
			required: true,
			default: 'ROWS',
			description: '移动的维度。',
		},
		{
			displayName: '起始位置',
			name: 'start_index',
			type: 'number',
			default: 0,
			description: '要移动的行或列的起始位置。从 0 开始计数。',
		},
		{
			displayName: '结束位置',
			name: 'end_index',
			type: 'number',
			default: 0,
			description: '要移动的行或列结束的位置。从 0 开始计数。',
		},
		{
			displayName: '目标位置',
			name: 'destination_index',
			type: 'number',
			default: null,
			required: true,
			description: '移动的目标位置行或者列。',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const spreadsheet_token = this.getNodeParameter('spreadsheet_toke', index) as string;
		const sheet_id = this.getNodeParameter('sheet_id', index) as string;
		const major_dimension = this.getNodeParameter('major_dimension', index) as string;
		const start_index = this.getNodeParameter('start_index', index) as number;
		const end_index = this.getNodeParameter('end_index', index) as number;
		const destination_index = this.getNodeParameter('destination_index', index) as number;

		const body: IDataObject = {
			source: {
				major_dimension,
				start_index,
				end_index,
			},
			destination_index,
		};

		return RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/sheets/v3/spreadsheets/${spreadsheet_token}/sheets/${sheet_id}/move_dimension`,
			body,
		});
	},
};

export default SpreadsheetDimensionMoveOperate;
