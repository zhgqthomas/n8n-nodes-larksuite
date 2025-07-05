import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';
import NodeUtils from '../../../help/utils/NodeUtils';

const SpreadsheetValuesAppendOperate: ResourceOperations = {
	name: '追加数据',
	value: 'spreadsheet:valuesAppend',
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
			description: '追加数据的范围。格式为 &lt;sheetId&gt;!&lt;开始位置&gt;:&lt;结束位置&gt;。',
		},
		{
			displayName: '数据',
			name: 'values',
			type: 'json',
			required: true,
			default: '',
			description: '参考：https://open.feishu.cn/document/ukTMukTMukTM/ugjN1UjL4YTN14CO2UTN',
		},
		{
			displayName: '插入数据选项',
			name: 'insertDataOption',
			type: 'options',
			options: [
				{
					name: '覆盖',
					value: 'OVERWRITE',
				},
				{
					name: '插入行',
					value: 'INSERT_ROWS',
				},
			],
			default: 'OVERWRITE',
			description: '指定追加数据的方式。',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const spreadsheetToken = this.getNodeParameter('spreadsheetToke', index) as string;
		const range = this.getNodeParameter('range', index) as string;
		const values = NodeUtils.getNodeJsonData(this, 'values', index) as IDataObject[];
		const insertDataOption = this.getNodeParameter('insertDataOption', index) as string;

		const body: IDataObject = {
			valueRange: {
				range,
				values,
			},
		};

		const response = await RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/sheets/v2/spreadsheets/${spreadsheetToken}/values_append`,
			qs: {
				insertDataOption,
			},
			body,
		});

		return response;
	},
};

export default SpreadsheetValuesAppendOperate;
