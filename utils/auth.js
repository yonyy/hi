const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const homePath =
	process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
const configPath = path.join(homePath, '/.hiconfig');

const auth = {
	readAuth: function() {
		return new Promise(function(resolve, reject) {
			fs.readFile(configPath, 'utf8', (err, data) => {
				if (err)
					return reject(
						'Config file is not present. Run the command `hi auth` first'
					);

				const json = JSON.parse(data);

				const { auth } = json;
				if (!auth) return reject('No credentials are present');
				return resolve(json);
			});
		});
	},
	deleteAuth: function() {
		return new Promise(function(resolve, reject) {
			fs.unlink(configPath, err => {
				if (err)
					reject(
						'Configuration file does not exist. No file was deleted'
					);
				resolve('Deleted configuration file');
			});
		});
	},
	updateAuth: function(config) {
		return new Promise(function(resolve, reject) {
			fs.writeFile(configPath, JSON.stringify(config), err => {
				if (err) return reject(err.message);
				return resolve('Configuration file created');
			});
		});
	},
	promptForAuth: function() {
		return new Promise(function(resolve, reject) {
			const questions = [
				{ type: 'input', name: 'username', message: 'Username' },
				{ type: 'password', name: 'password', message: 'Password' }
			];

			inquirer
				.createPromptModule()(questions)
				.then(({ username, password }) => {
					const authStr = username + ':' + password;
					const buff = Buffer.alloc(authStr.length);

					buff.write(authStr);

					const authEncoded = buff.toString('base64');
					return resolve({ auth: authEncoded });
				})
				.catch(reject);
		});
	},
	decryptAuth: function(config) {
		return new Promise(function(resolve, reject) {
			const auth = config.auth;

			if (!auth)
				return reject(
					'Token is missing. Run `hi auth` to regenerate configuation file'
				);

			return resolve({ auth });
		});
	}
};

module.exports = auth;
