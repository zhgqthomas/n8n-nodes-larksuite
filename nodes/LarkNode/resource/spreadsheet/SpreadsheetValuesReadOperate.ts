import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const SpreadsheetValuesReadOperate: ResourceOperations = {
	name: '读取单个范围',
	value: 'spreadsheet:valuesRead',
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
			description: '查询范围。格式为 &lt;sheetId&gt;!&lt;开始位置&gt;:&lt;结束位置&gt;。',
		},
		{
			displayName: '值渲染选项',
			name: 'valueRenderOption',
			type: 'options',
			options: [
				{ name: 'ToString', value: 'ToString' },
				{ name: 'Formula', value: 'Formula' },
				{ name: 'FormattedValue', value: 'FormattedValue' },
				{ name: 'UnformattedValue', value: 'UnformattedValue' },
			],
			default: 'ToString',
			description: '指定单元格数据的格式。',
		},
		{
			displayName: '日期时间渲染选项',
			name: 'dateTimeRenderOption',
			type: 'options',
			options: [
				{ name: 'FormattedString', value: 'FormattedString' },
			],
			default: 'FormattedString',
			description: '指定数据类型为日期、时间、或时间日期的单元格数据的格式。',
		},
		{
			displayName: '用户 ID 类型',
			name: 'userIdType',
			type: 'options',
			options: [
				{ name: 'Open_id', value: 'open_id' },
				{ name: 'Union_id', value: 'union_id' },
			],
			default: 'open_id',
			description: '当单元格中包含@用户等涉及用户信息的元素时，该参数可指定返回的用户 ID 类型。',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const spreadsheetToken = this.getNodeParameter('spreadsheetToke', index) as string;
		const range = this.getNodeParameter('range', index) as string;
		const valueRenderOption = this.getNodeParameter('valueRenderOption', index, '') as string;
		const dateTimeRenderOption = this.getNodeParameter('dateTimeRenderOption', index, '') as string;
		const userIdType = this.getNodeParameter('userIdType', index, 'lark_id') as string;

		const qs: IDataObject = {};
		if (valueRenderOption) qs.valueRenderOption = valueRenderOption;
		if (dateTimeRenderOption) qs.dateTimeRenderOption = dateTimeRenderOption;
		if (userIdType) qs.user_id_type = userIdType;

		const response = await RequestUtils.request.call(this, {
			method: 'GET',
			url: `/open-apis/sheets/v2/spreadsheets/${spreadsheetToken}/values/${range}`,
			qs,
		});

		return response;
	},
};

export default SpreadsheetValuesReadOperate;
