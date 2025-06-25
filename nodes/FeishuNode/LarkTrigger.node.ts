import { INodeType, INodeTypeDescription } from 'n8n-workflow';

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
		credentials: [
			{
				name: 'larkApi',
				required: true,
			},
		],
		properties: [
			// Define trigger-specific properties here
		],
	};
}
