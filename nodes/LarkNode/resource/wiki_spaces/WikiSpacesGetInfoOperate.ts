import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const WikiSpacesGetInfoOperate: ResourceOperations = {
	name: '获取知识空间信息',
	value: 'wiki:spaces:info',
	order: 100,
	options: [
		{
			displayName: '知识空间ID',
			name: 'space_id',
			type: 'string',
			required: true,
			default: '',
			description: '知识空间ID，可从知识空间列表获取。',
		},
		{
			displayName: '语言',
			name: 'lang',
			type: 'options',
			// eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
			options: [
				{ name: '简体中文', value: 'zh' },
				{ name: '印尼语', value: 'id' },
				{ name: '德语', value: 'de' },
				{ name: '英语', value: 'en' },
				{ name: '西班牙语', value: 'es' },
				{ name: '法语', value: 'fr' },
				{ name: '意大利语', value: 'it' },
				{ name: '葡萄牙语', value: 'pt' },
				{ name: '越南语', value: 'vi' },
				{ name: '俄语', value: 'ru' },
				{ name: '印地语', value: 'hi' },
				{ name: '泰语', value: 'th' },
				{ name: '韩语', value: 'ko' },
				{ name: '日语', value: 'ja' },
				{ name: '繁体中文（中国香港）', value: 'zh-HK' },
				{ name: '繁体中文（中国台湾）', value: 'zh-TW' },
			],
			default: 'zh',
			description: '返回的文档库名称展示语言。',
		}
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const spaceId = this.getNodeParameter('space_id', index) as string;
		const lang = this.getNodeParameter('lang', index) as string;

		return RequestUtils.request.call(this, {
			method: 'GET',
			url: `/open-apis/wiki/v2/spaces/${spaceId}`,
			qs: { lang },
		});
	},
};

export default WikiSpacesGetInfoOperate;
