import {
	INodeType,
	INodeTypeDescription,
	ITriggerFunctions,
	ITriggerResponse,
	NodeConnectionType,
	INodeExecutionData,
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
		const eventTypes = this.getNodeParameter('eventTypes', 0) as string[];

		const wsClient = new Lark.WSClient({ appId, appSecret, loggerLevel: Lark.LoggerLevel.info });

		// const eventMap: Record<string, (data: any) => Promise<void>> = {};
		// for (const eventType of eventTypes) {
		// 	eventMap[eventType] = async (data: any) => {
		// 		const item: INodeExecutionData = { json: data };
		// 		this.emit([item as INodeExecutionData]);
		// 	};
		// }

		const eventDispatcher = new Lark.EventDispatcher({}).register({

		});

		wsClient.start({ eventDispatcher });

		const closeFunction = async () => {
			if (typeof wsClient.close === 'function') {
				await wsClient.close();
			} else if (typeof wsClient.stop === 'function') {
				await wsClient.stop();
			}
		};
		return {
			closeFunction,
		};
	}

	/**
	 * 注册事件处理器。
	 * Register event handler.
	 */
	eventDispatcher = new Lark.EventDispatcher({}).register({
		/**
		 * 处理用户进入机器人单聊事件
		 * handle user enter bot single chat event
		 * https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/im-v1/chat-access_event/events/bot_p2p_chat_entered
		 */
		'im.chat.access_event.bot_p2p_chat_entered_v1': async (data) => {
			const {
				operator_id: { open_id },
			} = data;
			await sendWelcomeCard(open_id);
		},

		/**
		 * 处理用户点击机器人菜单事件
		 * handle user click bot menu event
		 * https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/application-v6/bot/events/menu
		 */
		'application.bot.menu_v6': async (data) => {
			const { operator, event_key } = data;
			const {
				operator_id: { open_id },
			} = operator;

			console.log('Received bot menu event:', data);

			/**
			 * 通过菜单 event_key 区分不同菜单。 你可以在开发者后台配置菜单的event_key
			 * Use event_key to distinguish different menus. You can configure the event_key of the menu in the developer console.
			 */
			if (event_key === 'send_alarm') {
				await sendAlarmCard('open_id', open_id);
			}
		},

		/**
		 * 接收用户发送的消息（包括单聊和群聊），接受到消息后发送告警卡片
		 * Register event handler to handle received messages, including individual chats and group chats.
		 * https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/im-v1/message/events/receive
		 */
		'im.message.receive_v1': async (data) => {
			const {
				message: { chat_type, chat_id },
				sender: {
					sender_id: { open_id },
				},
			} = data;
			console.log('Received message:', data);

			if (chat_type === 'group') {
				await sendAlarmCard('chat_id', chat_id);
			} else if (chat_type === 'p2p') {
				await sendAlarmCard('open_id', open_id);
			}
		},

		/**
		 * 处理卡片按钮点击回调
		 * handle card button click callback
		 * https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-callback-communication
		 */
		'card.action.trigger': async (data) => {
			const {
				operator: { open_id },
				action: { value, form_value = {} },
			} = data;
			console.log('Received card action:', data);

			/**
			 * 通过 action 区分不同按钮点击，你可以在卡片搭建工具配置按钮的action。此处处理用户点击了欢迎卡片中的发起告警按钮
			 * Use action to distinguish different buttons. You can configure the action of the button in the card building tool.
			 * Here, handle the situation where the user clicks the "Initiate Alarm" button on the welcome card.
			 */
			if (value.action === 'send_alarm') {
				/**
				 * 响应回调请求，保持卡片原内容不变
				 * Respond to the callback request and keep the original content of the card unchanged.
				 */
				await sendAlarmCard('open_id', open_id);
				return {};
			}

			/**
			 * 通过 action 区分不同按钮， 你可以在卡片搭建工具配置按钮的action。此处处理用户点击了告警卡片中的已处理按钮
			 * Use action to distinguish different buttons. You can configure the action of the button in the card building tool.
			 * Here, handle the scenario where the user clicks the "Mark as resolved" button on the alarm card.
			 */
			if (value.action === 'complete_alarm') {
				/**
				 * 读取告警卡片中用户填写的备注文本信息
				 * Read the note text information filled in by the user in the alarm card.
				 */
				const notes = form_value.notes_input || '';

				return {
					toast: {
						type: 'info',
						content: '已处理完成！',
						i18n: {
							zh_cn: '已处理完成！',
							en_us: 'Resolved!',
						},
					},
					card: {
						type: 'template',
						data: {
							template_id: ALERT_RESOLVED_CARD_ID,
							template_variable: {
								alarm_time: value.time,
								open_id: open_id,
								complete_time: `${new Date().toLocaleString(
									'zh-CN',
									{
										year: 'numeric',
										month: '2-digit',
										day: '2-digit',
										hour: '2-digit',
										minute: '2-digit',
										second: '2-digit',
										hour12: false,
									},
									{ timeZone: 'Asia/Shanghai' },
								)} (UTC+8)`,
								notes: notes,
							},
						},
					},
				};
			}
		},
	});
}
