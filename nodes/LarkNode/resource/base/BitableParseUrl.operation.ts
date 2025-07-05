import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { ResourceOperations } from '../../../help/type/IResource';
import RequestUtils from "../../../help/utils/RequestUtils";

const BitableParseUrlOperate: ResourceOperations = {
	name: '解析多维表格地址',
	value: 'bitable:parseUrl',
	order: 100,
	options: [
		{
			displayName: '多维表格地址',
			name: 'url',
			type: 'string',
			default: '',
			required: true,
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const url = this.getNodeParameter('url', index, '') as string;

		let data: IDataObject = {
			app_token: null,
			table_id: null,
			view_id: null
		};
		let matches = url.match(/\/base\/(.*?)(\?|$)/);
		if (matches) {
			data.app_token = matches[1];
		}else {
			matches = url.match(/\/wiki\/(.*?)(\?|$)/);
			if (matches) {
				let wikiToken = matches[1];
				// wiki 开头需要处理
				const res = await RequestUtils.request.call(this, {
					method: 'GET',
					url: '/open-apis/wiki/v2/spaces/get_node',
					qs: {
						token: wikiToken,
						obj_type: 'wiki'
					},
				})
				data.app_token = res?.data?.node?.obj_token
			}
		}
		matches = url.match(/table=(.*?)(&|$)/);
		if (matches) {
			data.table_id = matches[1];
		}
		matches = url.match(/view=(.*?)(&|$)/);
		if (matches) {
			data.view_id = matches[1];
		}

		return data;
	},
};

export default BitableParseUrlOperate;
