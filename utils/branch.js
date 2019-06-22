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
    const branch = null;
    if (infoObj.remote) {
      branch = colors.remote(['  ', infoObj.branch].join(''));
    } else {
      branch = infoObj.active
        ? colors.info(['*', infoObj.branch].join(' '))
        : ['  ', infoObj.branch].join('');
    }

    console.log('%s - %s', branch, infoObj.label);
  },
  createInfoObj: function(task, label = 'No PRB attached to this branch') {
    return Object.assign(task, { label });
  },
  createTaskObj: function(branch, task = null, table = null) {
    return Object.assign(branch, { task, table });
  },
  findTask: function(branchObj) {
    const task = branchObj.branch.match(/(PRB[\d]+)/g);
    const table = PRB;

    if (!task) return branch.createTaskObj(branchObj);

    return branch.createTaskObj(branchObj, task[0], table);
  },
  describe: function(branches) {
    return new Promise(function(resolve, reject) {
      const tasks = branches.map(branch.findTask);
      const requests = tasks.map(api.sendGlobalSearchRequest);
      Promise.all(requests)
        .then(labels => {
          labels.forEach((label, index) => {
            if (label)
              branch.prettyDisplay(branch.createInfoObj(tasks[index], label));
            else branch.prettyDisplay(branch.createInfoObj(tasks[index]));
          });
          resolve();
        })
        .catch(reject);
    });
  }
};

module.exports = branch;
