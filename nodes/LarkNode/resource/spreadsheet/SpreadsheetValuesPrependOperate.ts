import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const SpreadsheetValuesPrependOperate: ResourceOperations = {
	name: '插入数据',
	value: 'spreadsheet:valuesPrepend',
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
			description: '指定范围，用于写入数据。格式为 &lt;sheetId&gt;!&lt;开始位置&gt;:&lt;结束位置&gt;。',
		},
		{
			displayName: '数据',
			name: 'values',
			type: 'json',
			required: true,
			default: '',
			description: '参考：https://open.feishu.cn/document/ukTMukTMukTM/ugjN1UjL4YTN14CO2UTN',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const spreadsheetToken = this.getNodeParameter('spreadsheetToke', index) as string;
		const range = this.getNodeParameter('range', index) as string;
		const values = this.getNodeParameter('values', index) as IDataObject[];

		const body: IDataObject = {
			valueRange: {
				range,
				values,
			},
		};

		const response = await RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/sheets/v2/spreadsheets/${spreadsheetToken}/values_prepend`,
			body,
		});

		return response;
	},
};

export default SpreadsheetValuesPrependOperate;
