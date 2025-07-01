import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const SpreadsheetTableGetOperate: ResourceOperations = {
	name: '获取电子表格信息',
	value: 'spreadsheet:getInfo',
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
			displayName: '用户 ID 类型',
			name: 'user_id_type',
			type: 'options',
			options: [
				{ name: 'Open ID', value: 'open_id' },
				{ name: 'Union ID', value: 'union_id' },
				{ name: 'User ID', value: 'user_id' },
			],
			description: '用户 ID 类型。',
			default: 'open_id',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const spreadsheet_token = this.getNodeParameter('spreadsheet_toke', index) as string;
		const user_id_type = this.getNodeParameter('user_id_type', index) as string;

		return RequestUtils.request.call(this, {
			method: 'GET',
			url: `/open-apis/sheets/v3/spreadsheets/${spreadsheet_token}`,
			qs: {
				user_id_type,
			},
		});
	},
};

export default SpreadsheetTableGetOperate;
