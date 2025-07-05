import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

export default {
	name: '查询记录-通过记录ID',
	value: 'bitable:table:record:get',
	order: 70,
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
			displayName: '记录ID',
			name: 'record_id',
			type: 'string',
			required: true,
			default: '',
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

		{
			displayName: '是否返回记录的分享链接',
			name: 'with_shared_url',
			type: 'boolean',
			default: false,
		},
		{
			displayName: '是否返回自动计算的字段',
			name: 'automatic_fields',
			type: 'boolean',
			default: false,
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const app_token = this.getNodeParameter('app_toke', index) as string;
		const table_id = this.getNodeParameter('table_id', index) as string;
		const user_id_type = this.getNodeParameter('user_id_type', index) as string;
		const with_shared_url = this.getNodeParameter('with_shared_url', index) as boolean;
		const automatic_fields = this.getNodeParameter('automatic_fields', index) as boolean;
		const record_id = this.getNodeParameter('record_id', index) as string;

		return RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/bitable/v1/apps/${app_token}/tables/${table_id}/records/batch_get`,
			body: {
				record_ids: [record_id],
				user_id_type,
				with_shared_url,
				automatic_fields,
			},
		});
	},
} as ResourceOperations;
