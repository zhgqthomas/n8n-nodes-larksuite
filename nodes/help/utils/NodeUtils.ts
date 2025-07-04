import { IDataObject, IExecuteFunctions, NodeOperationError } from 'n8n-workflow';

class NodeUtils {
	static getNodeFixedCollection(data: IDataObject, collectionName: string): IDataObject[] {
		return (data[collectionName] as IDataObject[]) || [];
	}

	static getNodeFixedCollectionList(
		data: IDataObject,
		collectionName: string,
		propertyName: string,
	): any[] {
		const list = this.getNodeFixedCollection(data, collectionName);

		const result: IDataObject[] = [];
		for (const item of list) {
			// @ts-ignore
			result.push(item[propertyName]);
		}

		return result;
	}

	static async buildUploadFileData(
		this: IExecuteFunctions,
		inputDataFieldName: string,
		index: number = 0,
	) {
		const binaryData = this.helpers.assertBinaryData(index, inputDataFieldName);
		if (!binaryData) {
			throw new Error('未找到二进制数据');
		}
		const buffer = await this.helpers.getBinaryDataBuffer(index, inputDataFieldName);

		return {
			value: buffer,
			options: {
				filename: binaryData.fileName,
				filelength: binaryData.fileSize,
				contentType: binaryData.mimeType,
			},
		};
	}

	static getNodeJsonData(
		data: IExecuteFunctions,
		propertyName: string,
		index: number,
		failValue?: any,
	): any {
		const text = data.getNodeParameter(propertyName, index, failValue);
		if (!text) {
			return failValue;
		}
		try {
			// @ts-ignore
			return JSON.parse(text);
		} catch (e) {
			throw new NodeOperationError(
				data.getNode(),
				`无法解析字段[${propertyName}] JSON 数据: ${e.message}`,
			);
		}
	}
}

export default NodeUtils;
