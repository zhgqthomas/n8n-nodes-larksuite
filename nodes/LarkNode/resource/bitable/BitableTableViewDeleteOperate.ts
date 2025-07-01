import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

export default {
	name: '删除视图',
	value: 'bitable:table:view:delete',
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
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const app_token = this.getNodeParameter('app_toke', index) as string;
		const table_id = this.getNodeParameter('table_id', index) as string;
		const view_id = this.getNodeParameter('view_id', index) as string;

		return RequestUtils.request.call(this, {
			method: 'DELETE',
			url: `/open-apis/bitable/v1/apps/${app_token}/tables/${table_id}/views/${view_id}`,
		});
	},
} as ResourceOperations;
