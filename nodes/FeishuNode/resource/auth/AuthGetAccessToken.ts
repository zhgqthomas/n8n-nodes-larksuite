import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { ResourceOperations } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';

export default {
	name: '获取当前应用AccessToken',
	description: '需开通出口ip权限',
	value: 'auth:getAccessToken',
	options: [],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {

		await RequestUtils.request.call(this, {
			method: 'GET',
			url: `/open-apis/event/v1/outbound_ip`,
		});

		const credentials = await this.getCredentials('larkCredentialsApi');

		return {
			accessToken: credentials.accessToken,
		};
	},
} as ResourceOperations;
