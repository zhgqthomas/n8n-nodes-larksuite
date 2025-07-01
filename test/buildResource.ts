import ResourceFactory from '../nodes/help/builder/ResourceFactory';

const resourceBuilder = ResourceFactory.build(
	__dirname + '/../dist/nodes/LarkNode',
);

let txt = '';
for (let resource of resourceBuilder.resources) {
	txt = txt + '## ' +  resource.name + '\n';
	for (const operate of resource.operations) {
		txt = txt + '- '  + operate.name + '\n';
	}
}

console.log(txt);
