import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';
import nodeUtils from "../../../help/utils/NodeUtils";

const SpreadsheetValuesWriteOperate: ResourceOperations = {
	name: '写入数据',
	value: 'spreadsheet:valuesWrite',
	order: 70,
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
			displayName: '范围',
			name: 'range',
			type: 'string',
			required: true,
			default: '',
			description: '写入数据的范围。格式为 &lt;sheetId&gt;!&lt;开始位置&gt;:&lt;结束位置&gt;。',
		},
		{
			displayName: '数据',
			name: 'values',
			type: 'json',
			required: true,
			default: '[]',
			description: '参考：https://open.feishu.cn/document/server-docs/docs/sheets-v3/data-types-supported-by-sheets',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const spreadsheetToken = this.getNodeParameter('spreadsheetToke', index) as string;
		const range = this.getNodeParameter('range', index) as string;
		const values = nodeUtils.getNodeJsonData(this, 'values', index) as IDataObject[];

		const body: IDataObject = {
			valueRange: {
				range,
				values,
			},
		};

		const response = await RequestUtils.request.call(this, {
			method: 'PUT',
			url: `/open-apis/sheets/v2/spreadsheets/${spreadsheetToken}/values`,
			body,
		});

		return response;
	},
};

export default SpreadsheetValuesWriteOperate;
