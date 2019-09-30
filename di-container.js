const parseFunction = require('parse-function');

const app = parseFunction({
	ecmaVersion: 2017,
});

class DIContainer {
	constructor() {
		this.factories = {};
		this.dependencies = {};
	}

	register(name, dependency) {
		this.dependencies[name] = dependency;
	}

	factory(name, factory) {
		this.factories[name] = factory;
	}

	get(name) {
		if (!this.dependencies[name]) {
			const factory = this.factories[name];
			this.dependencies[name] = factory && this.inject(factory);
			if (!this.dependencies[name]) {
				throw new Error(`Cannot find module ${name}`);
			}
		}

		return this.dependencies[name];
	}

	inject(factory) {
		const fnArgs = app.parse(factory).args
			.map((dependency) => this.get(dependency));
		return factory(...fnArgs);
	}
}

module.exports = new DIContainer();
