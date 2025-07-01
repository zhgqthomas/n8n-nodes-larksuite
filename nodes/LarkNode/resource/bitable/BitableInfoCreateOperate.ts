import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const BitableInfoCreateOperate: ResourceOperations = {
	name: '创建多维表格',
	value: 'bitable:create',
	order: 100,
	options: [
		{
			displayName: '多维表格名称',
			name: 'name',
			type: 'string',
			default: '',
			description: '多维表格 App 名称。最长为 255 个字符。',
		},
		{
			displayName: '文件夹 Token',
			name: 'folder_toke',
			type: 'string',
			default: '',
			description: '多维表格 App 归属文件夹。默认为空，表示多维表格将被创建在云空间根目录。',
		},
		{
			displayName: '时区',
			name: 'time_zone',
			type: 'string',
			default: '',
			description: '文档时区。参考：https://feishu.feishu.cn/docx/YKRndTM7VoyDqpxqqeEcd67MnEf',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const name = this.getNodeParameter('name', index, '') as string;
		const folder_token = this.getNodeParameter('folder_toke', index, '') as string;
		const time_zone = this.getNodeParameter('time_zone', index, '') as string;

		const body: IDataObject = {};
		if (name) body.name = name;
		if (folder_token) body.folder_token = folder_token;
		if (time_zone) body.time_zone = time_zone;

		return RequestUtils.request.call(this, {
			method: 'POST',
			url: '/open-apis/bitable/v1/apps',
			body,
		});
	},
};

export default BitableInfoCreateOperate;
