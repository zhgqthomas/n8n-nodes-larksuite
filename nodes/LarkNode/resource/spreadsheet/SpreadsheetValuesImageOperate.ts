import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const SpreadsheetValuesImageOperate: ResourceOperations = {
	name: '写入图片',
	value: 'spreadsheet:valuesImage',
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
			description:
				'指定写入图片的单元格。格式为 &lt;sheetId&gt;!&lt;开始单元格&gt;:&lt;结束单元格&gt;。',
		},
		{
			displayName: '图片二进制字段',
			name: 'imageParameterName',
			type: 'string',
			required: true,
			default: '',
			description: '需要写入的图片的二进制流。',
		},
		{
			displayName: '图片名称',
			name: 'name',
			type: 'string',
			required: true,
			default: '',
			description: '写入的图片名称，需加后缀名。',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const spreadsheetToken = this.getNodeParameter('spreadsheetToke', index) as string;
		const range = this.getNodeParameter('range', index) as string;
		const imageParameterName = this.getNodeParameter('imageParameterName', index) as string;
		const name = this.getNodeParameter('name', index) as string;

		const binaryData = await this.helpers.getBinaryDataBuffer(index, imageParameterName);

		const body: IDataObject = {
			range,
			image: Array.from(binaryData),
			name,
		};

		const response = await RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/sheets/v2/spreadsheets/${spreadsheetToken}/values_image`,
			body,
		});

		return response;
	},
};

export default SpreadsheetValuesImageOperate;
