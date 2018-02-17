const { exec } = require('child_process');
const GIT_BRANCH = 'git branch';
const GIT_CONFIG = 'git config';

const branchObj = (branch, active = false) => {
    return { branch, active };
}

const git = {
    exec: function(commandStr) {
        return new Promise(function(resolve, reject) {
            exec(commandStr, (error, stdout) => {
                if (error) {
                    let message;
                    if (error.message.match(/Not a git repository/)) {
                        message = 'Not a git respository';
                    } else {
                        message = 'Unknown error';
                    }
                    return reject({ message });
                }
                return resolve(stdout.trim());
            });
        });
    },
    getBranches: function(remote) {
        return new Promise((resolve, reject) => {
            let command = [GIT_BRANCH];
            if (remote)
                command = command.concat('-r');

            let commandStr = command.join(' ');
            git.exec(commandStr)
               .then(resolve)
               .catch(reject)

        });
    },
    getCurrentBranch: function() {
        return new Promise(function(resolve, reject) {
            let command = GIT_BRANCH;
            git.exec(GIT_BRANCH)
               .then(stdout => {
                    let [activeBranch] =  stdout
                                        .split('\n')
                                        .filter(branch => branch.substring(0,1) === '*')
                    resolve(activeBranch.substring(2));
               })
               .catch(reject);
        });
    },
    getCurrentBranchObj: function() {
        return new Promise(function(resolve, reject) {
            git.getCurrentBranch()
               .then(branchStr => resolve(git.parseBranches(branchStr)))
               .catch(reject)
        });
    },
    getBranchObjs: function(remote) {
        return new Promise(function(resolve, reject) {
            git.getBranches(remote)
               .then(branchStr => resolve(git.parseBranches(branchStr)))
               .catch(reject)
        });
    },
    parseBranches: function(branchStr) {
        const strip = (branch) => {
            if (branch.substring(0,1) === '*')
                return branchObj(branch.substring(2), true);
            return branchObj(branch);
        };

        return branchStr
                .split('\n')
                .map(strip);
    }
}

module.exports = git;
