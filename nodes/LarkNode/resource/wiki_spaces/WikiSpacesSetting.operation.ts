import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const WikiSpacesUpdateSettingOperate: ResourceOperations = {
	name: '更新知识空间设置',
	value: 'wiki:spaces:settings:update',
	order: 98,
	options: [
		{
			displayName: '知识空间ID',
			name: 'space_id',
			type: 'string',
			required: true,
			default: '',
		},
		{
			displayName: '一级页面创建权限',
			name: 'create_setting',
			type: 'options',
			options: [
				{ name: '管理员和成员', value: 'admin_and_member' },
				{ name: '仅管理员', value: 'admin' },
			],
			default: 'admin_and_member',
			description: '谁可以创建空间的一级页面',
		},
		{
			displayName: '文档操作权限',
			name: 'security_setting',
			type: 'options',
			options: [
				{ name: '允许', value: 'allow' },
				{ name: '不允许', value: 'not_allow' },
			],
			default: 'allow',
			description: '可阅读用户是否可创建副本/打印/导出/复制',
		},
		{
			displayName: '评论权限',
			name: 'comment_setting',
			type: 'options',
			options: [
				{ name: '允许', value: 'allow' },
				{ name: '不允许', value: 'not_allow' },
			],
			default: 'allow',
			description: '可阅读用户是否可评论',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const spaceId = this.getNodeParameter('space_id', index) as string;
		const createSetting = this.getNodeParameter('create_setting', index) as string;
		const securitySetting = this.getNodeParameter('security_setting', index) as string;
		const commentSetting = this.getNodeParameter('comment_setting', index) as string;

		const body: IDataObject = {};

		if (createSetting) {
			body.create_setting = createSetting;
		}
		if (securitySetting) {
			body.security_setting = securitySetting;
		}
		if (commentSetting) {
			body.comment_setting = commentSetting;
		}

		return RequestUtils.request.call(this, {
			method: 'PUT',
			url: `/open-apis/wiki/v2/spaces/${spaceId}/setting`,
			body,
		});
	},
};

export default WikiSpacesUpdateSettingOperate;
