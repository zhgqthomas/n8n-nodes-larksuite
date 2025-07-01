import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const WikiSpacesNodeGetInfoOperate: ResourceOperations = {
	name: '获取知识空间节点信息',
	value: 'wiki:spaces:node:info',
	order: 90,
	options: [
		{
			displayName: '节点Token',
			name: 'token',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
			description: '知识库节点或对应云文档的实际token',
		},
		{
			displayName: '文档类型',
			name: 'obj_type',
			type: 'options',
			// eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
			options: [
				{ name: '知识库节点', value: 'wiki' },
				{ name: '旧版文档', value: 'doc' },
				{ name: '新版文档', value: 'docx' },
				{ name: '表格', value: 'sheet' },
				{ name: '思维导图', value: 'mindnote' },
				{ name: '多维表格', value: 'bitable' },
				{ name: '文件', value: 'file' },
				{ name: '幻灯片', value: 'slides' }
			],
			default: 'wiki',
			description: '文档类型，不传时默认以wiki类型查询',
		}
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const token = this.getNodeParameter('token', index) as string;
		const objType = this.getNodeParameter('obj_type', index) as string;

		const qs: IDataObject = {
			token,
		};

		if (objType !== 'wiki') {
			qs.obj_type = objType;
		}

		return RequestUtils.request.call(this, {
			method: 'GET',
			url: '/open-apis/wiki/v2/spaces/get_node',
			qs,
		});
	},
};

export default WikiSpacesNodeGetInfoOperate;
