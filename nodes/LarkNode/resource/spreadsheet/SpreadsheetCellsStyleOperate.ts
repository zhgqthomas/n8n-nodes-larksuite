import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const SpreadsheetCellsStyleOperate: ResourceOperations = {
	name: '设置单元格样式',
	value: 'spreadsheet:setCellStyle',
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
			displayName: '设置范围',
			name: 'range',
			type: 'string',
			required: true,
			default: '',
			description: '设置样式的范围，格式为 &lt;sheetId&gt;!&lt;开始位置&gt;:&lt;结束位置&gt;。',
		},
		{
			displayName: '需要更新的样式',
			name: 'style',
			type: 'collection',
			default: {},
			options: [
				{
					displayName: '字体相关样式',
					name: 'font',
					type: 'collection',
					default: {},
					options: [
						{
							displayName: '字体大小',
							name: 'fontSize',
							type: 'string',
							default: '',
							description: '字体大小，如 10pt/1.5。其中 10pt 表示字号，取值范围为 [9,36]pt。1.5 为行距，固定为 1.5px。',
						},
						{
							displayName: '是否加粗',
							name: 'bold',
							type: 'boolean',
							default: false,
						},
						{
							displayName: '是否斜体',
							name: 'italic',
							type: 'boolean',
							default: false,
						},
						{
							displayName: '是否清除字体格式',
							name: 'clean',
							type: 'boolean',
							default: false,
						},
					],
				},
				{
					displayName: '文本装饰',
					name: 'textDecoration',
					type: 'options',
					default: 0,
					options: [
						{
							name: '无',
							value: 0,
						},
						{
							name: '下划线',
							value: 1,
						},
						{
							name: '删除线',
							value: 2,
						},
						{
							name: '下划线和删除线',
							value: 3,
						},
					],
				},
				{
					displayName: '数字格式',
					name: 'formatter',
					type: 'string',
					default: '',
					description: '数字格式，详见电子表格支持的数字格式类型。',
				},
				{
					displayName: '水平对齐方式',
					name: 'hAlign',
					type: 'number',
					default: 0,
					description: '水平对齐方式。可选值：0：左对齐，1：中对齐，2：右对齐。',
				},
				{
					displayName: '垂直对齐方式',
					name: 'vAlign',
					type: 'number',
					default: 0,
					description: '垂直对齐方式。可选值：0：上对齐，1：中对齐，2：下对齐。',
				},
				{
					displayName: '字体颜色',
					name: 'foreColor',
					type: 'color',
					default: '',
					description: '字体颜色，用十六进制颜色代码表示。',
				},
				{
					displayName: '背景颜色',
					name: 'backColor',
					type: 'color',
					default: '',
					description: '背景颜色，用十六进制颜色代码表示。',
				},
				{
					displayName: '边框类型',
					name: 'borderType',
					type: 'string',
					default: 'NO_BORDER',
					description: '边框类型，可选值：FULL_BORDER：全边框，OUTER_BORDER：外边框，INNER_BORDER：内边框，NO_BORDER：无边框，LEFT_BORDER：左边框，RIGHT_BORDER：右边框，TOP_BORDER：上边框，BOTTOM_BORDER：下边框。',
				},
				{
					displayName: '边框颜色',
					name: 'borderColor',
					type: 'color',
					default: '',
					description: '边框颜色，用十六进制颜色代码表示。',
				},
			]
		}
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const spreadsheetToken = this.getNodeParameter('spreadsheetToke', index) as string;
		const range = this.getNodeParameter('range', index) as string;
		const style = this.getNodeParameter('style', index) as IDataObject;

		const body: IDataObject = {
			appendStyle: {
				range,
				style
			},
		};

		return RequestUtils.request.call(this, {
			method: 'PUT',
			url: `/open-apis/sheets/v2/spreadsheets/${spreadsheetToken}/style`,
			body,
		});
	},
};

export default SpreadsheetCellsStyleOperate;
