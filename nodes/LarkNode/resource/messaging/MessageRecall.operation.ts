import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const MessageRecallOperate: ResourceOperations = {
	name: '撤回消息',
	value: 'message:recall',
	options: [
		{
			displayName: '待撤回的消息的ID',
			name: 'message_id',
			type: 'string',
			required: true,
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const message_id = this.getNodeParameter('message_id', index) as string;

		return RequestUtils.request.call(this, {
			method: 'DELETE',
			url: `/open-apis/im/v1/messages/${message_id}`,
		});
	},
};

export default MessageRecallOperate;
