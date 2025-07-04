import { INodePropertyOptions } from 'n8n-workflow/dist/Interfaces';
import { IDataObject, type IExecuteFunctions, INodeProperties } from 'n8n-workflow';

export type ResourceOperations = INodePropertyOptions & {
	options: INodeProperties[];
	call?: (this: IExecuteFunctions, index: number) => Promise<IDataObject>;
	// 默认100
	order?: number;
};

export type ResourceOptions = INodePropertyOptions & {
	// 默认100
	order?: number;
};

export interface IResource extends INodePropertyOptions {
	operations: ResourceOperations[];
}
