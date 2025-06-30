import {
	INodeType,
	INodeTypeDescription,
	ITriggerFunctions,
	ITriggerResponse,
	NodeConnectionType,
	NodeOperationError,
} from 'n8n-workflow';
import * as Lark from '@larksuiteoapi/node-sdk';

export class LarkTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Lark Trigger',
		name: 'LarkTrigger',
		icon: 'file:icon.png',
		group: ['trigger'],
		version: 1,
		description: 'Triggers for Lark events (via long connection)',
		defaults: {
			name: 'Lark Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'larkCredentialsApi',
				required: true,
			},
		],
		properties: [
			{
				displayName:
					'Due to Lark API limitations, you can use just one Lark trigger for each bot at a time',
				name: 'LarkTriggerNotice',
				type: 'notice',
				default: '',
			},
			{
				displayName: 'Trigger On',
				name: 'updates',
				type: 'multiOptions',
				options: [
					{
						name: '*',
						value: '*',
						description: 'All updates',
					},
				],
				required: true,
				default: [],
			},
		],
	};

	async trigger(this: ITriggerFunctions): Promise<ITriggerResponse | undefined> {
		const credentials = await this.getCredentials('larkCredentialsApi');

		if (!credentials.appid || !credentials.appsecret) {
			throw new NodeOperationError(this.getNode(), 'Missing required Slack Socket credentials');
		}
		const appId = credentials['appid'] as string;
		const appSecret = credentials['appsecret'] as string;

		let wsClient = new Lark.WSClient({ appId, appSecret, loggerLevel: Lark.LoggerLevel.info });

		// const eventMap: Record<string, (data: any) => Promise<void>> = {};
		// for (const eventType of eventTypes) {
		// 	eventMap[eventType] = async (data: any) => {
		// 		const item: INodeExecutionData = { json: data };
		// 		this.emit([item as INodeExecutionData]);
		// 	};
		// }

		const eventDispatcher = new Lark.EventDispatcher({}).register({
		/**
		 * 处理用户进入机器人单聊事件
		 * handle user enter bot single chat event
		 * https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/im-v1/chat-access_event/events/bot_p2p_chat_entered
		 */
		'im.chat.access_event.bot_p2p_chat_entered_v1': async (data) => {
			this.logger.info(`Lark data:  ${JSON.stringify(data)}`);
		}
		});

		const manualTriggerFunction = async () => {
			try {
				wsClient.start({ eventDispatcher });
				this.logger.info('Started Lark app in test mode');
			} catch (error) {
				this.logger.error('Error starting Lark app in test mode: ' + error);
				throw error;
			}

			return new Promise<void>((resolve) => {
				resolve();
			});
		};

		if (this.getMode() === 'trigger') {
			try {
				wsClient.start({ eventDispatcher });
				this.logger.info('Started Lark app in trigger mode');
			} catch (error) {
				this.logger.error('Error starting Lark app in trigger mode: ' + error);
				throw error;
			}
		}

		const closeFunction = async () => {
			try {
				// wsClient = null;
				this.logger.info('Stopped Lark app');
			} catch (error) {
				this.logger.error('Error stopping Lark app: ' + error);
			}
		};
		return {
			closeFunction,
			manualTriggerFunction
		};
	}
}
