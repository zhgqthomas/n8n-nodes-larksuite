import { INodePropertyOptions } from 'n8n-workflow/dist/Interfaces';
import { IResource, ResourceOperations } from '../type/IResource';
import { INodeProperties } from 'n8n-workflow';

class ResourceBuilder {
	resources: IResource[] = [];

	addResource(resource: INodePropertyOptions) {
		this.resources.push({
			...resource,
			operations: [],
		});
	}

	addOperation(resourceName: string, operation: ResourceOperations) {
		const resource = this.resources.find((resource) => resource.value === resourceName);
		if (resource) {
			resource.operations.push(operation);
		}
	}

	build(): INodeProperties[] {
		// 构建 Operations
		let list: INodeProperties[] = [];

		list.push({
			displayName: 'Resource',
			name: 'resource',
			type: 'options',
			noDataExpression: true,
			options: this.resources.map((item) => {
				return {
					...item,
					operations: null,
				};
			}),
			default: '',
		});

		for (const resource of this.resources) {
			if (resource.operations.length === 0) continue;
			list.push({
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: [resource.value],
					},
				},
				options: resource.operations.map((item) => {
					return {
						...item,
						options: null,
					};
				}),
				default: '',
			});

			for (const operation of resource.operations) {
				for (let option of operation.options) {
					// @ts-ignore
					list.push({
						...option,
						displayOptions: {
							...(option.displayOptions || {}),
							show: {
								...(option.displayOptions?.show || {}),
								resource: [resource.value],
								operation: [operation.value],
							},
						},
					});
				}
			}
		}

		return list;
	}

	getCall(resourceName: string, operateName: string): Function | null {
		const resource = this.resources.find((item) => item.value === resourceName);
		if (!resource) {
			// @ts-ignore
			return null;
		}
		const operate = resource.operations.find((item) => item.value === operateName);
		// @ts-ignore
		return operate?.call;
	}
}

export default ResourceBuilder;
