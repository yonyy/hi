const request = require('request');
const auth = require('./auth');
const BT1_URL =
	'https://buildtools1.service-now.com/api/now/globalsearch/search';
const PRB_URL =
	'https://buildtools1.service-now.com/api/now/globalsearch/search';

const api = {
	urls: function() {
		return {
			BT1_URL,
			PRB_URL
		};
	},
	sendGlobalSearchRequest: function(taskObj, options) {
		const { url, queryParams, responseHandler } = options;

		return new Promise((resolve, reject) => {
			const { task } = taskObj;
			if (!task) return resolve(null);

			auth.readAuth()
				.then(config => {
					const options = {
						url,
						qs: queryParams,
						headers: {
							Authorization: 'Basic ' + config.auth
						}
					};

					return request(options, (err, _, body) => {
						const parsedBody = JSON.parse(body);
						if (err) return reject(err.message);

						if (parsedBody.error)
							return reject(parsedBody.error.message);

						return resolve(responseHandler(parsedBody));
					});
				})
				.catch(reject);
		});
	}
};

module.exports = api;
