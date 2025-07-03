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
			{
				displayName: 'Event Filter',
				name: 'eventFilter',
				type: 'options',
				options: [
					{
						name: 'All Events',
						value: 'all_events',
					},
					{
						name: 'Specific Events',
						value: 'specific_events',
					},
				],
				default: 'all_events',
				description:
					'Check the documentation for available events(https://open.larksuite.com/document/server-docs/event-subscription/event-list)',
			},
			{
				displayName: 'Specific Events',
				name: 'events',
				type: 'multiOptions',
				options: [
					{
						name: 'Plan Created',
						value: 'planCreated',
					},
					{
						name: 'Plan Deleted',
						value: 'planDeleted',
					},
				],
				default: [],
				description: 'The events to be monitored',
				displayOptions: {
					show: {
						eventFilter: ['specific_events'],
					},
				},
			},
			{
				displayName: 'Callback Filter',
				name: 'callbackFilter',
				type: 'options',
				options: [
					{
						name: 'All Callbacks',
						value: 'all_callbacks',
					},
					{
						name: 'Specific Callbacks',
						value: 'specific_callbacks',
					},
				],
				default: 'all_callbacks',
				description:
					'Check the documentation for available callbacks(https://open.feishu.cn/document/event-subscription-guide/callback-subscription/callback-overview#c8a9d6ae)',
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
