const { exec } = require('child_process');
const GIT_BRANCH = 'git branch';
const GIT_CONFIG = 'git config';

const branchObj = (branch, active = false, remote = false) => {
  return { branch, active, remote };
};

const git = {
  getErrorMessage: function(err) {
    if (err.message.match(/Not a git repository/))
      return 'Not a git respository';

    return 'Unknown error';
  },
  exec: function(commandStr) {
    return new Promise(function(resolve, reject) {
      exec(commandStr, (error, stdout) => {
        if (error) {
          const message = git.getErrorMessage(error);

          return reject({ message });
        }
        return resolve(stdout.trim());
      });
    });
  },
  getBranches: function(remote) {
    return new Promise((resolve, reject) => {
      const command = [GIT_BRANCH];
      if (remote) command = command.concat('-r');

      const commandStr = command.join(' ');
      git
        .exec(commandStr)
        .then(resolve)
        .catch(reject);
    });
  },
  getCurrentBranch: function() {
    return new Promise(function(resolve, reject) {
      const command = GIT_BRANCH;
      git
        .exec(GIT_BRANCH)
        .then(stdout => {
          const [activeBranch] = stdout
            .split('\n')
            .filter(branch => branch.substring(0, 1) === '*');
          resolve(activeBranch.substring(2));
        })
        .catch(reject);
    });
  },
  getCurrentBranchObj: function() {
    return new Promise(function(resolve, reject) {
      git
        .getCurrentBranch()
        .then(branchStr => resolve(git.parseBranches(branchStr)))
        .catch(reject);
    });
  },
  getBranchObjs: function(remote) {
    return new Promise(function(resolve, reject) {
      git
        .getBranches(remote)
        .then(branchStr => resolve(git.parseBranches(branchStr, remote)))
        .catch(reject);
    });
  },
  parseBranches: function(branchStr, remote) {
    const strip = branch => {
      branch = branch.trim();
      if (branch.substring(0, 1) === '*')
        return branchObj(branch.substring(2), true, remote);
      return branchObj(branch, false, remote);
    };

    return branchStr.split('\n').map(strip);
  }
};

module.exports = git;
