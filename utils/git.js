const _ = require('lodash');
const { exec } = require('child_process');
const GIT_BRANCH = 'git branch';

const branchObj = (branch, active = false) => {
    return { branch, active };
}

const git = {
    getBranches: function(remote) {
        return new Promise((resolve, reject) => {
            let command = [GIT_BRANCH];
            if (remote)
                command = _.concact(command, '-r', remote);
            let commandStr = _.join(command, ' ');

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
                return resolve(this.parseBranches(stdout.trim()));
            });
        });
    },
    parseBranches: function(branchStr) {
        const strip = (branch) => {
            if (_.startsWith(branch, '*'))
                return branchObj(branch.substring(2), true);
            return branchObj(branch);
        };

        return _.chain(branchStr)
                .split('\n')
                .map(strip)
                .value();
    }
}

module.exports = git;
