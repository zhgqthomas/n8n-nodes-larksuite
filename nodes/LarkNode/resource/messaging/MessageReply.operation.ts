import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const MessageReplyOperate: ResourceOperations = {
	name: '回复消息',
	value: 'message:reply',
	options: [
		{
			displayName: '待回复的消息的ID',
			name: 'message_id',
			type: 'string',
			required: true,
			default: '',
		},
		{
			displayName: '消息类型',
			name: 'msg_type',
			type: 'options',
			// eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
			options: [
				{ name: '文本', value: 'text' },
				{ name: '富文本', value: 'post' },
				{ name: '图片', value: 'image' },
				{ name: '文件', value: 'file' },
				{ name: '语音', value: 'audio' },
				{ name: '视频', value: 'media' },
				{ name: '表情包', value: 'sticker' },
				{ name: '卡片', value: 'interactive' },
				{ name: '分享群名片', value: 'share_chat' },
				{ name: '分享个人名片', value: 'share_user' },
			],
			description: '参考：https://open.feishu.cn/document/server-docs/im-v1/message-content-description/create_json',
			required: true,
			default: 'text',
		},
		{
			displayName: '消息内容',
			name: 'content',
			type: 'json',
			default: '{"text":"reply content"}',
			description: '消息内容，JSON 结构序列化后的字符串。',
			required: true,
		},
		{
			displayName: 'UUID',
			name: 'uuid',
			type: 'string',
			default: '',
			description: '自定义设置的唯一字符串序列，用于在回复消息时请求去重。',
		},
		{
			displayName: '是否以话题形式回复',
			name: 'reply_in_thread',
			type: 'boolean',
			default: false,
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const message_id = this.getNodeParameter('message_id', index) as string;
		const msg_type = this.getNodeParameter('msg_type', index) as string;
		const content = this.getNodeParameter('content', index) as string;
		const uuid = this.getNodeParameter('uuid', index) as string;
		const reply_in_thread = this.getNodeParameter('reply_in_thread', index) as boolean;

		const body: IDataObject = {
			msg_type,
			content,
		};
		if (uuid) {
			body.uuid = uuid;
		}
		if (reply_in_thread) {
			body.reply_in_thread = reply_in_thread;
		}

		return RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/im/v1/messages/${message_id}/reply`,
			body,
		});
	},
};

export default MessageReplyOperate;
