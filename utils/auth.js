const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const homePath = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
const configPath = path.join(homePath, '/.hiconfig');

const auth = {
    readAuth: function() {
        return new Promise(function(resolve, reject) {
            fs.readFile(configPath, 'utf8', (err, data) => {
                if (err)
                    return reject('Config file is not present. Run the command `hi auth` first');

                var json = JSON.parse(data);

                var { auth } = json;
                if (!auth)
                    return reject('No credentials are present');
                return resolve(json);
            });
        });
    },
    deleteAuth: function() {
        return new Promise(function(resolve, reject) {
            fs.unlink(configPath, (err) => {
                resolve('Deleted configuration file');
            })
        });
    },
    updateAuth: function(config) {
        return new Promise(function(resolve, reject) {
            fs.writeFile(configPath, JSON.stringify(config), (err) => {
                if (err)
                    return reject(err.message);
                return resolve('Configuration file created');
            });
        });
    },
    promptForAuth: function() {
        return new Promise(function(resolve, reject) {
            var questions = [
                { type: 'input', name: 'username', message: 'Username'},
                { type: 'password', name: 'password', message: 'Password'}
            ];

            inquirer.createPromptModule()(questions)
            .then(({ username, password }) => {
                let auth = new Buffer(username + ':' + password).toString('base64');
                return resolve({ auth });
            })
            .catch(reject);
        });
    }
}

module.exports = auth;
