import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';
import NodeUtils from "../../../help/utils/NodeUtils";

export default  {
	name: '新增字段',
	value: 'bitable:table:field:add',
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
			displayName: '操作的唯一标识',
			name: 'client_toke',
			type: 'string',
			default: '',
			description: '操作的唯一标识，与接口返回值的 client_token 相对应，用于幂等的进行更新操作。此值为空表示将发起一次新的请求，此值非空表示幂等的进行更新操作',
		},

		{
			displayName: '请求体JSON',
			name: 'body',
			type: 'json',
			required: true,
			default: '{"field_name":"测试","type":1}',
			description:
				'参考：https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table-field/create#requestBody',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const app_token = this.getNodeParameter('app_toke', index) as string;
		const table_id = this.getNodeParameter('table_id', index) as string;
		const client_token = this.getNodeParameter('client_toke', index) as string;
		const body = NodeUtils.getNodeJsonData(this, 'body', index) as IDataObject;

		const qs : any = {}
		if (client_token) qs.client_token = client_token

		return RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/bitable/v1/apps/${app_token}/tables/${table_id}/fields`,
			qs,
			body: body
		});
	},
} as ResourceOperations;
