import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { ResourceOperations } from '../../../help/type/IResource';
import NodeUtils from '../../../help/utils/NodeUtils';
import RequestUtils from '../../../help/utils/RequestUtils';

export default {
	name: '更新任务',
	value: 'task:update',
	order: 100,
	options: [
		{
			displayName: '任务ID',
			name: 'task_guid',
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
			displayName: '请求体',
			name: 'body',
			type: 'json',
			required: true,
			default: '{"update_fields": []}',
			description:
				'参考：https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/task-v2/task/patch#requestBody',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const task_guid = this.getNodeParameter('task_guid', index) as string;
		const user_id_type = this.getNodeParameter('user_id_type', index) as string;
		const body = NodeUtils.getNodeJsonData(this, "body", index) as IDataObject;

		return RequestUtils.request.call(this, {
			method: 'PATCH',
			url: `/open-apis/task/v2/tasks/${task_guid}`,
			qs: {
				user_id_type: user_id_type,
			},
			body: body
		});
	},

} as ResourceOperations;
