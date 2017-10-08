const _ = require('lodash');
const request = require('request');
const colors = require('colors/safe');
const auth = require('./auth');
const HI_URL = 'https://hi.service-now.com/api/now/globalsearch/search';
const TASK = '8c58a5aa0a0a0b07008047e8ef0fe07d';
const PRB = 'problem';

colors.setTheme({
    info: 'green'
});

const prettyDisplay = (description) => {
    var branch = (description.active) ? colors.info(_.join(['*', description.branch], ' ')) : description.branch
    console.log('%s - %s', branch, description.label);
}

const infoObj = (prb, label = 'No PRB attached to this branch') => {
    return Object.assign(prb, { label });
}

const prbObj = (branch, prb = null) => {
    return Object.assign(branch, {prb});
}

const getPRB = (branch) => {
    let prb = branch.branch.match(/(PRB[\d]+)/g);
    if (!prb)
        return prbObj(branch);
    return prbObj(branch, prb[0]);
}

const hi = {
    sendAjax: function (prbObj) {
        return new Promise((resolve, reject) => {
            var { prb } = prbObj
            if (!prb)
                return resolve(infoObj(prbObj));

            auth.readAuth()
                .then(auth.decryptAuth)
                .then(config => {
                    var options = {
                        url: HI_URL,
                        qs: {
                            sysparm_search: prb,
                            sysparm_groups: TASK
                        },
                        auth: {
                            username: config.username,
                            password: config.password
                        }
                    }

                    return request(options, (err, res, body) => {
                        var parsedBody = JSON.parse(body);
                        if (err)
                            return reject(err.message);

                        if (parsedBody.error)
                            return reject(parsedBody.error.message);

                        var records = parsedBody.result.groups[0].search_results.filter(v => v.name === PRB)[0].records;

                        if (!records)
                            return resolve(infoObj(prbObj));

                        var record = records.filter(r => r.data.number.value === prb)[0];
                        var label = record.metadata.title;

                        return resolve(infoObj(prbObj, label));
                    });
                })
                .catch(reject);
        });
    },
    describe: function(branches) {
        return new Promise(function(resolve, reject) {
            var prbs = _.map(branches, getPRB);
            var info = _.map(prbs, hi.sendAjax);
            Promise.all(info)
                .then(descriptions => {
                    _.forEach(descriptions, description => {
                        prettyDisplay(description);
                    });
                    resolve();
                })
                .catch(reject)
        });
    }
}

module.exports = hi;
