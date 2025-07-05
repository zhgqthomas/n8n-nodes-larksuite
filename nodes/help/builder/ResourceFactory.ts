import ResourceBuilder from './ResourceBuilder';
import { ResourceOperation, ResourceOptions } from '../type/IResource';
import ModuleLoadUtils from '../utils/ModuleLoadUtils';

class ResourceFactory {
	static build(basedir: string): ResourceBuilder {
		const resourceBuilder = new ResourceBuilder();
		const resources: ResourceOptions[] = ModuleLoadUtils.loadModules(basedir, 'resource/*.js');
		// 排序
		resources.sort((a, b) => {
			if (!a.order) a.order = 0;
			if (!b.order) b.order = 0;
			return b.order - a.order;
		});
		resources.forEach((resource) => {
			resourceBuilder.addResource(resource);
			const operations: ResourceOperation[] = ModuleLoadUtils.loadModules(
				basedir,
				`resource/${resource.value}/*.js`,
			);
			// 排序
			operations.sort((a, b) => {
				if (!a.order) a.order = 0;
				if (!b.order) b.order = 0;
				return b.order - a.order;
			});
			operations.forEach((operation: ResourceOperation) => {
				// @ts-ignore
				resourceBuilder.addOperation(resource.value, operation);
			});
		});
		return resourceBuilder;
	}
}

export default ResourceFactory;
