import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';
import NodeUtils from "../../../help/utils/NodeUtils";

const BitableTableAddOperate: ResourceOperations = {
	name: '新增数据表',
	value: 'bitable:table:add',
	order: 90,
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
			displayName: '请求体JSON',
			name: 'body',
			type: 'json',
			required: true,
			default: '{"table":{}}',
			description: '参考：https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table/create',
		}
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const app_token = this.getNodeParameter('app_toke', index) as string;
		const body = NodeUtils.getNodeJsonData(this,  'body', index) as IDataObject;

		return RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/bitable/v1/apps/${app_token}/tables`,
			body,
		});
	},
};

export default BitableTableAddOperate;
