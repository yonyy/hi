const _ = require('lodash');

const prbObj = (branch, prb = null) => {
    console.log('prb obj', Object.assign(branch, {prb}));
    return Object.assign(branch, {prb});
}

const getPRB = (branch) => {
    let prb = branch.branch.match(/(PRB[\d]+)/g);
    console.log('prb:', prb);
    if (!prb)
        return prbObj(branch);
    return prbObj(branch, prb[0]);
}

const hi = {
    sendAjax: (prb) => {
        return new Promise((resolve, reject) => {
            resolve(1);
        });
    },
    describe: (branches) => {
        console.log(branches);
        var prbs = _.map(branches, getPRB);
    }

}

module.exports = hi;
