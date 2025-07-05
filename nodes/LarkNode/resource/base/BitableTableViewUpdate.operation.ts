import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';
import NodeUtils from "../../../help/utils/NodeUtils";

export default  {
	name: '更新视图',
	value: 'bitable:table:view:update',
	order: 80,
	options: [
		{
			displayName: '多维表格 Token',
			name: 'app_toke',
			type: 'string',
			required: true,
			default: '',
			description: '多维表格 App 的唯一标识。',
		},
		{
			displayName: '多维表格 ID',
			name: 'table_id',
			type: 'string',
			required: true,
			default: '',
			description: '多维表格数据表的唯一标识。',
		},
		{
			displayName: '视图 ID',
			name: 'view_id',
			type: 'string',
			required: true,
			default: '',
			description: '多维表格中视图的唯一标识。',
		},
		{
			displayName: '视图名称',
			name: 'view_name',
			type: 'string',
			default: '',
			description: '长度不超过 100 个字符, 不为空且不包含这些特殊符号：[ ]',
		},
		{
			displayName: '视图属性',
			name: 'property',
			type: 'json',
			default: '{}',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const app_token = this.getNodeParameter('app_toke', index) as string;
		const table_id = this.getNodeParameter('table_id', index) as string;
		const view_id = this.getNodeParameter('view_id', index) as string;
		const view_name = this.getNodeParameter('view_name', index) as string;
		const property = NodeUtils.getNodeJsonData(this, 'property', index) as IDataObject;

		const body : any = {}

		if (view_name) {
			body.view_name = view_name
		}
		if (property) {
			body.property = property
		}

		return RequestUtils.request.call(this, {
			method: 'PATCH',
			url: `/open-apis/bitable/v1/apps/${app_token}/tables/${table_id}/views/${view_id}`,
			body: body
		});
	},
} as ResourceOperations;
