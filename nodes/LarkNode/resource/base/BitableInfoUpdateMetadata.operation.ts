import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const BitableInfoUpdateMetadataOperate: ResourceOperations = {
	name: '更新多维表格元数据',
	value: 'bitable:updateMetadata',
	order: 100,
	options: [
		{
			displayName: '多维表格 Token',
			name: 'app_toke',
			type: 'string',
			required: true,
			default: '',
			description: '目标多维表格的 App token。',
		},
		{
			displayName: '多维表格名称',
			name: 'name',
			type: 'string',
			default: '',
			description: '多维表格 App 名称。',
		},
		{
			displayName: '是否开启高级权限',
			name: 'enable_advanced_permissions',
			type: 'boolean',
			default: false,
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const app_token = this.getNodeParameter('app_toke', index) as string;
		const name = this.getNodeParameter('name', index, '') as string;
		const enable_advanced_permissions = this.getNodeParameter('enable_advanced_permissions', index, false) as boolean;

		const body: IDataObject = {};
		if (name) body.name = name;
		body.enable_advanced_permissions = enable_advanced_permissions;

		return RequestUtils.request.call(this, {
			method: 'PUT',
			url: `/open-apis/bitable/v1/apps/${app_token}`,
			body,
		});
	},
};

export default BitableInfoUpdateMetadataOperate;
