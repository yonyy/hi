const colors = require('colors/safe');
const api = require('./api');
const PRB = 'problem';
const STRY = 'story';
const INT = 'incident';

colors.setTheme({
    info: 'green',
    remote: 'red'
});

const branch = {
    prettyDisplay: function(infoObj) {
        var branch = null;
        if (infoObj.remote) {
            branch = colors.remote(['  ', infoObj.branch].join(''));
        } else {
            branch = (infoObj.active) ? colors.info(['*', infoObj.branch].join(' ')) : ['  ', infoObj.branch].join('');
        }

        console.log('%s - %s', branch, infoObj.label);
    },
    createInfoObj: function(task, label = 'No STRY/PRB/INT attached to this branch') {
        return Object.assign(task, { label });
    },
    createTaskObj: function(branch, task = null, table = null) {
        return Object.assign(branch, {task, table});
    },
    findTask: function(branchObj) {
        let task = branchObj.branch.match(/(PRB[\d]+)/g);
        let table = PRB;

        if (!task) {
            task = branchObj.branch.match(/(STRY[\d]+)/g);
            table = STRY;
        }

        if (!task) {
            task = branchObj.branch.match(/(INT[\d]+)/g);
            table = INT;
        }

        if (!task)
            return branch.createTaskObj(branchObj);

        return branch.createTaskObj(branchObj, task[0], table);
    },
    describe: function(branches) {
        return new Promise(function(resolve, reject) {
            var tasks = branches.map(branch.findTask);
            var requests = tasks.map(api.sendGlobalSearchRequest);
            Promise.all(requests)
                .then(labels => {
                    labels.forEach((label, index) => {
                        if (label)
                            branch.prettyDisplay(branch.createInfoObj(tasks[index], label));
                        else
                            branch.prettyDisplay(branch.createInfoObj(tasks[index]));
                    });
                    resolve();
                })
                .catch(reject)
        });
    }
}

module.exports = branch;
