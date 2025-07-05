import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const MessageEditOperate: ResourceOperations = {
	name: '编辑消息',
	value: 'message:edit',
	options: [
		{
			displayName: '待编辑的消息的ID',
			name: 'message_id',
			type: 'string',
			required: true,
			default: '',
		},
		{
			displayName: '消息类型',
			name: 'msg_type',
			type: 'options',
			options: [
				{ name: '文本', value: 'text' },
				{ name: '富文本', value: 'post' },
			],
			description: '消息类型。',
			required: true,
			default: 'text',
		},
		{
			displayName: '消息内容',
			name: 'content',
			type: 'json',
			default: '{"text":"edit content"}',
			description: '消息内容，JSON 结构序列化后的字符串。',
			required: true,
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const message_id = this.getNodeParameter('message_id', index) as string;
		const msg_type = this.getNodeParameter('msg_type', index) as string;
		const content = this.getNodeParameter('content', index) as string;

		const body: IDataObject = {
			msg_type,
			content,
		};

		return RequestUtils.request.call(this, {
			method: 'PUT',
			url: `/open-apis/im/v1/messages/${message_id}`,
			body,
		});
	},
};

export default MessageEditOperate;
