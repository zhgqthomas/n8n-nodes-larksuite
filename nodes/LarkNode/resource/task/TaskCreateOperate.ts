import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { ResourceOperations } from '../../../help/type/IResource';
import NodeUtils from '../../../help/utils/NodeUtils';
import RequestUtils from '../../../help/utils/RequestUtils';

export default {
	name: '创建任务',
	value: 'task:create',
	order: 100,
	options: [
		{
			displayName: '任务标题',
			name: 'summary',
			type: 'string',
			required: true,
			default: '',
		},
		{
			displayName: '任务摘要',
			name: 'description',
			type: 'string',
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
			displayName: '其他参数',
			name: 'body',
			type: 'json',
			required: true,
			default: '{}',
			description:
				'参考：https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/task-v2/task/create#requestBody',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const summary = this.getNodeParameter('summary', index) as string;
		const description = this.getNodeParameter('description', index) as string;
		const user_id_type = this.getNodeParameter('user_id_type', index) as string;
		const extObject = NodeUtils.getNodeJsonData(this, "body", index) as IDataObject;

		const body = {
			summary,
			description,
			...extObject
		}

		return RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/task/v2/tasks`,
			qs: {
				user_id_type: user_id_type,
			},
			body: body
		});
	},

} as ResourceOperations;
