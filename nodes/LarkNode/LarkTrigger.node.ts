import {
	INodeType,
	INodeTypeDescription,
	ITriggerFunctions,
	ITriggerResponse,
	NodeConnectionType,
	NodeOperationError,
	IRun,
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

	async trigger(this: ITriggerFunctions): Promise<ITriggerResponse> {
		const credentials = await this.getCredentials('larkCredentialsApi');

		if (!(credentials.appid && credentials.appsecret)) {
			throw new NodeOperationError(this.getNode(), 'Missing required Lark credentials');
		}
		const appId = credentials['appid'] as string;
		const appSecret = credentials['appsecret'] as string;
		const baseUrl = credentials['baseUrl'] as string;
		const nodeVersion = this.getNode().typeVersion;

		const wsClient: WSClient = new WSClient({
			appId,
			appSecret,
			domain: baseUrl === 'open.feishu.cn' ? Domain.Feishu : Domain.Lark,
			logger: this.logger,
			helpers: this.helpers,
		});

		const closeFunction = async () => {
			await wsClient.stop(); // Close the WebSocket connection
		};

		const startWsClient = async () => {
			const eventDispatcher = new EventDispatcher({ logger: this.logger }).register({
				'im.message.receive_v1': async (data) => {
					console.log(`Received im.message.receive_v1 event: ${JSON.stringify(data)}`);

					let responsePromise = undefined;
					if ((nodeVersion as number) > 1) {
						responsePromise = this.helpers.createDeferredPromise<IRun>();
						this.emit([this.helpers.returnJsonArray([data])], undefined, responsePromise);
					} else {
						this.emit([this.helpers.returnJsonArray([data])]);
					}

					if (responsePromise) {
						await responsePromise.promise;
					}
				},
			});

			await wsClient.start({ eventDispatcher });
		};

		if (this.getMode() !== 'manual') {
			await startWsClient();
			return {
				closeFunction,
			};
		} else {
			const manualTriggerFunction = async () => {
				await startWsClient();
			};

			return {
				closeFunction,
				manualTriggerFunction,
			};
		}
	}
}
