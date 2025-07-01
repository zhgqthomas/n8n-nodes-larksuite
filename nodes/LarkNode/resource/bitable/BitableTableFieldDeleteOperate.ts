import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

export default {
	name: '删除字段',
	value: 'bitable:table:field:delete',
	order: 60,
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
			displayName: '字段 ID',
			name: 'field_id',
			type: 'string',
			required: true,
			default: '',
			description: '数据表中一个字段的唯一标识。',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const app_token = this.getNodeParameter('app_toke', index) as string;
		const table_id = this.getNodeParameter('table_id', index) as string;
		const field_id = this.getNodeParameter('field_id', index) as string;

		return RequestUtils.request.call(this, {
			method: 'DELETE',
			url: `/open-apis/bitable/v1/apps/${app_token}/tables/${table_id}/fields/${field_id}`,
		});
	},
} as ResourceOperations;
