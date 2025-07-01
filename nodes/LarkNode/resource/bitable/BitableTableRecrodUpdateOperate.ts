import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';
import NodeUtils from "../../../help/utils/NodeUtils";

export default  {
	name: '更新记录',
	value: 'bitable:table:record:update',
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
			displayName: '记录 ID',
			name: 'record_id',
			type: 'string',
			required: true,
			default: '',
			description: '数据表中一条记录的唯一标识。通过查询记录接口获取。',
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
			default: '{"fields":{}}',
			description:
				'参考：https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table-record/update#requestBody',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const app_token = this.getNodeParameter('app_toke', index) as string;
		const table_id = this.getNodeParameter('table_id', index) as string;
		const record_id = this.getNodeParameter('record_id', index) as string;

		const user_id_type = this.getNodeParameter('user_id_type', index) as string;
		const ignore_consistency_check = this.getNodeParameter('ignore_consistency_check', index, true) as boolean;
		const body = NodeUtils.getNodeJsonData(this, 'body', index) as IDataObject;

		const qs : any = {}
		if (user_id_type) qs.user_id_type = user_id_type
		qs.ignore_consistency_check = ignore_consistency_check

		return RequestUtils.request.call(this, {
			method: 'PUT',
			url: `/open-apis/bitable/v1/apps/${app_token}/tables/${table_id}/records/${record_id}`,
			qs,
			body: body
		});
	},
} as ResourceOperations;
