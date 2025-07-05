import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';
import NodeUtils from "../../../help/utils/NodeUtils";

const MessageBatchSendOperate: ResourceOperations = {
	name: '批量发送消息',
	value: 'message:batchSend',
	options: [
		{
			displayName: '消息类型',
			name: 'msg_type',
			type: 'options',
			// eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
			options: [
				{ name: '文本', value: 'text' },
				{ name: '图片', value: 'image' },
				{ name: '富文本', value: 'post' },
				{ name: '分享群名片', value: 'share_chat' },
				{ name: '卡片', value: 'interactive' },
			],
			description: '消息类型。',
			required: true,
			default: 'text',
		},
		{
			displayName: '消息内容',
			name: 'content',
			type: 'json',
			default: '{"text":"要发送的文本消息"}',
			description: '消息内容，JSON 结构。',
			displayOptions: {
				show: {
					msg_type: ['text', 'image', 'post', 'share_chat'],
				},
			},
		},
		{
			displayName: '卡片内容',
			name: 'card',
			type: 'json',
			default: '{"elements":[{"tag":"div","text":{"content":"This is the plain text","tag":"plain_text"}}],"header":{"template":"blue","title":{"content":"This is the title","tag":"plain_text"}}}',
			description: '卡片内容，JSON 结构。参考：https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/send-feishu-card',
			displayOptions: {
				show: {
					msg_type: ['interactive'],
				},
			},
		},
		{
			displayName: '部门 ID 列表',
			name: 'department_ids',
			type: 'json',
			default: '[]',
			description: '部门 ID 列表。',
		},
		{
			displayName: '用户 Open_id 列表',
			name: 'open_ids',
			type: 'json',
			default: '[]',
			description: '用户 open_id 列表。',
		},
		{
			displayName: '用户 User_id 列表',
			name: 'user_ids',
			type: 'json',
			default: '[]',
			description: '用户 user_id 列表。',
		},
		{
			displayName: '用户 Union_id 列表',
			name: 'union_ids',
			type: 'json',
			default: '[]',
			description: '用户 union_id 列表。',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const msg_type = this.getNodeParameter('msg_type', index) as string;
		const content = NodeUtils.getNodeJsonData(this, 'content', index, null) as object;
		const card = NodeUtils.getNodeJsonData(this, 'card', index, null) as object;
		const department_ids = NodeUtils.getNodeJsonData(this, 'department_ids', index) as [];
		const open_ids = NodeUtils.getNodeJsonData(this, 'open_ids', index) as [];
		const user_ids = NodeUtils.getNodeJsonData(this, 'user_ids', index) as [];
		const union_ids = NodeUtils.getNodeJsonData(this, 'union_ids', index) as [];

		const body: IDataObject = {
			msg_type,
		};

		if (msg_type === 'interactive') {
			body.card = card;
		} else {
			body.content = content;
		}

		if (department_ids && department_ids.length > 0) {
			body.department_ids = department_ids;
		}
		if (open_ids && open_ids.length > 0) {
			body.open_ids = open_ids;
		}
		if (user_ids && user_ids.length > 0) {
			body.user_ids = user_ids;
		}
		if (union_ids && union_ids.length > 0) {
			body.union_ids = union_ids;
		}

		return RequestUtils.request.call(this, {
			method: 'POST',
			url: '/open-apis/message/v4/batch_send/',
			body,
		});
	},
};

export default MessageBatchSendOperate;
