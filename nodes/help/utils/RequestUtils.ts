import { IExecuteFunctions } from 'n8n-workflow';
import { IRequestOptions } from 'n8n-workflow/dist/Interfaces';

class RequestUtils {
	static async originRequest(
		this: IExecuteFunctions,
		options: IRequestOptions,
		clearAccessToken = false,
	) {
		const credentials = await this.getCredentials('larkCredentialsApi');

		return this.helpers.requestWithAuthentication
			.call(this, 'larkCredentialsApi', options, {
				// @ts-ignore
				credentialsDecrypted: {
					data: {
						...credentials,
						accessToken: clearAccessToken ? '' : credentials.accessToken,
					},
				},
			})
	}

	static async request(this: IExecuteFunctions, options: IRequestOptions) {
		if (options.json === undefined) options.json = true;

		return RequestUtils.originRequest.call(this, options).then((data) => {
			const handleResponse = (data: any) => {
				if (data.code && data.code !== 0) {
					throw new Error(
						`Request Error: ${data.code}, ${data.msg} \n ` + JSON.stringify(data.error),
					);
				}
				return data;
			};

			// 处理一次accesstoken过期的情况
			if (data.code && data.code === 99991663) {
				return RequestUtils.originRequest.call(this, options, true).then((data) => {
					return handleResponse(data);
				});
			}

			return handleResponse(data);
		});
	}
}

export default RequestUtils;
