const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const inquirer = require('inquirer');
const algorithm = 'aes-256-ctr';
const homePath = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
const configPath = path.join(homePath, '/.hiconfig');

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
                let token = createToken();
                let base64 = new Buffer(username + ':' + password).toString('base64');
                let auth = encrypt(base64, token);
                return resolve({ auth, token });
            })
            .catch(reject);
        });
    },
    decryptAuth: function(config) {
        return new Promise(function(resolve, reject) {
            var token = config.token

            if (!token)
                return reject('Token is missing. Run `hi auth` to regenerate configuation file');
            var auth = decrypt(config.auth, token);
            return resolve({ auth, token });
        });
    },
}

module.exports = auth;
