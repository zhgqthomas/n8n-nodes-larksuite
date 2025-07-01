import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { ResourceOperations } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';

export default {
	name: '创建共享日历',
	value: 'calendar:create',
	options: [
		{
			displayName: '日历标题',
			name: 'summary',
			type: 'string',
			default: '',
			description: '日历标题。最大长度：255 字符',
		},
		{
			displayName: '日历描述',
			name: 'description',
			type: 'string',
			default: '',
			description: '日历描述。最大长度：255 字符',
		},
		{
			displayName: '日历公开范围',
			name: 'permissions',
			type: 'options',
			options: [
				{ name: '私密', value: 'private' },
				{ name: '仅展示忙闲信息', value: 'show_only_free_busy' },
				{ name: '公开，他人可查看日程详情', value: 'public' },
			],
			default: 'show_only_free_busy',
			description: '日历公开范围。',
		},
		{
			displayName: '日历颜色',
			name: 'color',
			type: 'number',
			default: -14513409,
			description: '日历颜色，取值通过颜色 RGB 值的 int32 表示。日历颜色会映射到飞书客户端色板上最接近的一种颜色进行展示。',
		},
		{
			displayName: '日历备注名',
			name: 'summary_alias',
			type: 'string',
			default: '',
			description: '日历备注名，设置该字段后（包括后续修改该字段）仅对当前身份生效。最大长度：255 字符',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const summary = this.getNodeParameter('summary', index, '') as string;
		const description = this.getNodeParameter('description', index, '') as string;
		const permissions = this.getNodeParameter('permissions', index, 'show_only_free_busy') as string;
		const color = this.getNodeParameter('color', index, -14513409) as number;
		const summary_alias = this.getNodeParameter('summary_alias', index, '') as string;

		const body: IDataObject = {};

		if (summary) body.summary = summary;
		if (description) body.description = description;
		if (permissions) body.permissions = permissions;
		if (color !== undefined) body.color = color;
		if (summary_alias) body.summary_alias = summary_alias;

		return RequestUtils.request.call(this, {
			method: 'POST',
			url: '/open-apis/calendar/v4/calendars',
			body
		});
	},
} as ResourceOperations;
