import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

export default {
	name: '列出数据表',
	value: 'bitable:table:list',
	order: 90,
	options: [
		{
			displayName: '多维表格 Token',
			name: 'app_toke',
			type: 'string',
			required: true,
			default: '',
			description: '多维表格 App 的唯一标识。',
		},
		{
			displayName: '分页标记',
			name: 'page_toke',
			type: 'string',
			default: '',
			description:
				'分页标记，第一次请求不填，表示从头开始遍历；分页查询结果还有更多项时会同时返回新的 page_token，下次遍历可采用该 page_token 获取查询结果',
		},
		{
			displayName: '分页大小',
			name: 'page_size',
			type: 'number',
			default: 20,
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const app_token = this.getNodeParameter('app_toke', index) as string;
		const page_token = this.getNodeParameter('page_toke', index, '') as string;
		const page_size = this.getNodeParameter('page_size', index, 20) as number;

		return RequestUtils.request.call(this, {
			method: 'GET',
			url: `/open-apis/bitable/v1/apps/${app_token}/tables`,
			qs: {
				page_token,
				page_size,
			},
		});
	},
} as ResourceOperations;
