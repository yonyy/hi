const colors = require('colors/safe');
const api = require('./api');
const tableResolver = require('./tableResolver');

colors.setTheme({
	active: 'green',
	remote: 'red'
});

const branch = {
	getBranchDisplay: function({ remote, label, active }) {
		if (remote) return colors.remote(`  ${label}`);

		if (active) return colors.active(`* ${label}`);

		return `  ${label}`;
	},
	prettyDisplay: function(infoObj) {
		const branchDisplay = this.getBranchDisplay(infoObj);
		console.log(`${branchDisplay} - ${infoObj.message}`);
	},
	createInfoObj: function(task, message = 'No PRB attached to this branch') {
		return {
			...task,
			message
		};
	},
	generateData: function(branchObj) {
		const options = tableResolver(branchObj.label);

		return {
			...branchObj,
			...options
		};
	},
	describe: function(branches) {
		return new Promise(function(resolve, reject) {
			const tasks = branches.map(branch.generateData);
			const requests = tasks.map(api.sendGlobalSearchRequest);
			Promise.all(requests)
				.then(labels => {
					labels.forEach((label, index) => {
						if (label)
							branch.prettyDisplay(
								branch.createInfoObj(tasks[index], label)
							);
						else
							branch.prettyDisplay(
								branch.createInfoObj(tasks[index])
							);
					});
					resolve();
				})
				.catch(reject);
		});
	}
};

module.exports = branch;
