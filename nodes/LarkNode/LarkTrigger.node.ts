import {
	INodeType,
	INodeTypeDescription,
	ITriggerFunctions,
	ITriggerResponse,
	NodeConnectionType,
	NodeOperationError,
} from 'n8n-workflow';
import { WSClient } from '../wsclient';
import { Domain } from '../wsclient/enum';
import { EventDispatcher } from '../wsclient/dispatcher';

export class LarkTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Lark Trigger',
		name: 'LarkTrigger',
		icon: 'file:lark_icon.svg',
		group: ['trigger'],
		version: 1,
		description: 'Triggers for Lark events',
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
					'Due to Lark API limitations, you can use just one Lark trigger for each lark bot at a time',
				name: 'LarkTriggerNotice',
				type: 'notice',
				default: '',
			},
		],
	};

	async trigger(this: ITriggerFunctions): Promise<ITriggerResponse | undefined> {
		const credentials = await this.getCredentials('larkCredentialsApi');

		if (!credentials.appid || !credentials.appsecret) {
			throw new NodeOperationError(this.getNode(), 'Missing required Lark credentials');
		}
		const appId = credentials['appid'] as string;
		const appSecret = credentials['appsecret'] as string;
		const baseUrl = credentials['baseUrl'] as string;

		let wsClient: WSClient = new WSClient({
			appId,
			appSecret,
			domain: baseUrl === 'open.feishu.cn' ? Domain.Feishu : Domain.Lark,
			logger: this.logger,
			helpers: this.helpers,
		});

		const eventDispatcher = new EventDispatcher({ logger: this.logger }).register({
			'im.message.receive_v1': async (data) => {
				console.log(`Received im.message.receive_v1 event: ${JSON.stringify(data)}`);
			},
		});

		const manualTriggerFunction = async () => {
			try {
				await wsClient.start({ eventDispatcher });
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
				await wsClient.start({ eventDispatcher });
				this.logger.info('Started Lark app in trigger mode');
			} catch (error) {
				this.logger.error('Error starting Lark app in trigger mode: ' + error);
				throw error;
			}
		}

		const closeFunction = async () => {
			try {
				await wsClient.stop(); // Close the WebSocket connection
				this.logger.info('Lark app has been stopped');
			} catch (error) {
				this.logger.error('Error stopping Lark app: ' + error);
			}
		};

		return {
			closeFunction,
			manualTriggerFunction,
		};
	}
}
