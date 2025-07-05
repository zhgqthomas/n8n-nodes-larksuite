import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

export default {
	name: '列出视图',
	value: 'bitable:table:view:list',
	order: 80,
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
			displayName: '多维表格 ID',
			name: 'table_id',
			type: 'string',
			required: true,
			default: '',
			description: '多维表格数据表的唯一标识。',
		},
		{
			displayName: '分页大小',
			name: 'page_size',
			type: 'number',
			required: true,
			default: 10,
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
			displayName: '用户 ID 类型',
			name: 'user_id_type',
			type: 'options',
			default: 'open_id',
			options: [
				{
					name: 'Open_id',
					value: 'open_id',
				},
				{
					name: 'Union_id',
					value: 'union_id',
				},
				{
					name: 'User_id',
					value: 'user_id',
				},
			],
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const app_token = this.getNodeParameter('app_toke', index) as string;
		const table_id = this.getNodeParameter('table_id', index) as string;

		const page_size = this.getNodeParameter('page_size', index) as string;
		const page_token = this.getNodeParameter('page_toke', index) as string;
		const user_id_type = this.getNodeParameter('user_id_type', index) as string;

		const qs: any = {};

		if (page_size) {
			qs.page_size = page_size;
		}
		if (page_token) {
			qs.page_token = page_token;
		}
		if (user_id_type) {
			qs.user_id_type = user_id_type;
		}

		return RequestUtils.request.call(this, {
			method: 'GET',
			url: `/open-apis/bitable/v1/apps/${app_token}/tables/${table_id}/views`,
			qs: qs,
		});
	},
} as ResourceOperations;
