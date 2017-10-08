const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const inquirer = require('inquirer');
const algorithm = 'aes-256-ctr';
const homePath = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
const configPath = path.join(homePath, '/.snbranchcookie');

function configObj({ username, password, token, cookie }) {
    return { username, password, token, cookie };
}

function encrypt(text, token){
    var cipher = crypto.createCipher(algorithm, token);
    var crypted = cipher.update(text,'utf8','hex');
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text, token) {
    var decipher = crypto.createDecipher(algorithm, token);
    var dec = decipher.update(text,'hex','utf8');
    dec += decipher.final('utf8');
    return dec;
}

function createToken() {
    var buf = crypto.randomBytes(128);
    return buf.toString('hex');
}

const auth = {
    readAuth: function(ignoreError = false) {
        return new Promise(function(resolve, reject) {
            fs.readFile(configPath, 'utf8', (err, data) => {
                if (err)
                    if (!ignoreError)
                        return reject('Config file is not present. Run the command `hi auth` first');
                    else
                        return resolve({})

                var json = JSON.parse(data);

                var { token, cookie, username, password } = json;
                if (!cookie && !username && !password)
                    if (!ignoreError)
                        return reject('No credentials or cookie are present');

                return resolve({ token, cookie, username, password });
            });
        });
    },
    decryptAuth: function(config) {
        return new Promise(function(resolve, reject) {
            var token = config.token
            var username = (config.username) ? decrypt(config.username, token) : null;
            var password = (config.password) ? decrypt(config.password, token) : null;
            var cookie = (config.cookie) ? decrypt(config.cookie, token) : null;
            return resolve({ username, password, cookie, token });
        });
    },
    deleteAuth: function() {
        return new Promise(function(resolve, reject) {
            fs.unlink(configPath, (err) => {
                resolve('Deleted configuration file');
            })
        });
    },
    updateAuth: function(info) {
        return new Promise(function(resolve, reject) {
            var config = configObj(info);
            fs.writeFile(configPath, JSON.stringify(info), (err) => {
                if (err)
                    return reject(err.message);
                return resolve('Information saved');
            });
        });
    },
    promptForAuth: function() {
        return new Promise(function(resolve, reject) {
            var questions = [
                {
                    type: 'list',
                    name: 'auth',
                    message: 'How would you like to store your credentials?',
                    choices: [
                        { name: 'Cookie', value: 'cookie' },
                        { name: 'Username w/ password', value: 'up' }
                    ]
                }
            ];

            inquirer.createPromptModule()(questions)
                .then(answers => {
                    var { auth } = answers;
                    resolve(auth)
                })
                .catch(reject);
        });
    },
    promptForCookie: function() {
        return new Promise(function(resolve, reject) {
            var questions = [
                { type: 'input', name: 'cookie', message: 'Cookie'},
            ];

            var token = null;
            var username = null;
            var password = null;
            var cookie = null;
            auth.readAuth(true)
                .then(auth.decryptAuth)
                .then(config => {
                    token = createToken();
                    username = (config.username) ? encrypt(config.username, token) : null;
                    password = (config.password) ? encrypt(config.password, token) : null;
                    return inquirer.createPromptModule()(questions);
                })
                .then(answers => {
                    cookie = encrypt(answers.cookie, token);
                    return resolve({ username, password, cookie, token });
                })
                .catch(reject);
        });
    },
    promptForPW: function() {
        return new Promise(function(resolve, reject) {
            var questions = [
                { type: 'input', name: 'username', message: 'Username'},
                { type: 'password', name: 'password', message: 'Password'}
            ];

            var token = null;
            var username = null;
            var password = null;
            var cookie = null;
            auth.readAuth(true)
                .then(auth.decryptAuth)
                .then(config => {
                    token = createToken();
                    cookie = (config.cookie) ? encrypt(config.cookie, token) : null;
                    return inquirer.createPromptModule()(questions);
                })
                .then(answers => {
                    username = encrypt(answers.username, token);
                    password = encrypt(answers.password, token);
                    return resolve({ username, password, cookie, token });
                })
                .catch(reject);
        });
    }
}

module.exports = auth;
