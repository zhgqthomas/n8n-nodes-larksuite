import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const WikiSpacesNodeCreateOperate: ResourceOperations = {
	name: '创建知识空间节点',
	value: 'wiki:spaces:node:create',
	order: 90,
	options: [
		{
			displayName: '知识空间ID',
			name: 'space_id',
			type: 'string',
			required: true,
			default: '',
		},
		{
			displayName: '文档类型',
			name: 'obj_type',
			type: 'options',
			// eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
			options: [
				{ name: '文档', value: 'docx' },
				{ name: '表格', value: 'sheet' },
				{ name: '思维导图', value: 'mindnote' },
				{ name: '多维表格', value: 'bitable' },
				{ name: '文件', value: 'file' },
			],
			default: 'docx',
		},
		{
			displayName: '父节点Token',
			name: 'parent_node_token',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: '父节点token，一级节点为空',
		},
		{
			displayName: '节点类型',
			name: 'node_type',
			type: 'options',
			required: true,
			options: [
				{ name: '实体', value: 'origin' },
				{ name: '快捷方式', value: 'shortcut' },
			],
			default: 'origin',
		},
		{
			displayName: '原始节点Token',
			name: 'origin_node_token',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: '快捷方式对应的实体node_token',
		},
		{
			displayName: '文档标题',
			name: 'title',
			type: 'string',
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const spaceId = this.getNodeParameter('space_id', index) as string;
		const objType = this.getNodeParameter('obj_type', index) as string;
		const nodeType = this.getNodeParameter('node_type', index) as string;
		const parentNodeToken = this.getNodeParameter('parent_node_token', index) as string;
		const originNodeToken = this.getNodeParameter('origin_node_token', index) as string;
		const title = this.getNodeParameter('title', index) as string;

		const body: IDataObject = {
			obj_type: objType,
			node_type: nodeType,
		};

		if (parentNodeToken) body.parent_node_token = parentNodeToken;
		if (originNodeToken) body.origin_node_token = originNodeToken;
		if (title) body.title = title;

		return RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/wiki/v2/spaces/${spaceId}/nodes`,
			body,
		});
	},
};

export default WikiSpacesNodeCreateOperate;
