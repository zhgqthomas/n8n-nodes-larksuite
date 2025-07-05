import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';
import NodeUtils from "../../../help/utils/NodeUtils";

export default  {
	name: '批量新增记录',
	value: 'bitable:table:record:batchAdd',
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
			displayName: '操作的唯一标识',
			name: 'client_toke',
			type: 'string',
			default: '',
			description: '操作的唯一标识，与接口返回值的 client_token 相对应，用于幂等的进行更新操作。此值为空表示将发起一次新的请求，此值非空表示幂等的进行更新操作',
		},
		{
			displayName: '是否忽略一致性读写检查',
			name: 'ignore_consistency_check',
			type: 'boolean',
			default: true,
		},

		{
			displayName: '请求体JSON',
			name: 'body',
			type: 'json',
			required: true,
			default: '{"records":[]}',
			description:
				'参考：https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table-record/batch_create#requestBody',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const app_token = this.getNodeParameter('app_toke', index) as string;
		const table_id = this.getNodeParameter('table_id', index) as string;
		const user_id_type = this.getNodeParameter('user_id_type', index) as string;
		const client_token = this.getNodeParameter('client_toke', index) as string;
		const ignore_consistency_check = this.getNodeParameter('ignore_consistency_check', index, true) as boolean;
		const body = NodeUtils.getNodeJsonData(this, 'body', index) as IDataObject;

		const qs : any = {}
		if (user_id_type) qs.user_id_type = user_id_type
		if (client_token) qs.client_token = client_token
		qs.ignore_consistency_check = ignore_consistency_check

		return RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/bitable/v1/apps/${app_token}/tables/${table_id}/records/batch_create`,
			qs,
			body: body
		});
	},
} as ResourceOperations;
