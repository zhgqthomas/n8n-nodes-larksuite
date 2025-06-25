import { INodeType, INodeTypeDescription, NodeConnectionType } from 'n8n-workflow';

export class LarkTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Lark Trigger',
		name: 'LarkTrigger',
		icon: 'file:icon.png',
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
			// Define trigger-specific properties here
		],
	};
}
