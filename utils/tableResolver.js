const api = require('./api');

const {
	responseBaseHandler,
	prbResponseHandler
} = require('./responseHandlers');

const DEFECT_PREFIX = 'DEF';
const PRB_PREFIX = 'PRB';
const STRY_PREFIX = 'STRY';

const DEFECT = 'x_snc_defect_defect';
const STRY = 'rm_story';
const PRB = 'problem';

const prbMatch = /(PRB\d+)/g;
const defectMatch = /(DEF\d+)/g;
const stryMatch = /(STRY\d+)/g;

const TASK = '8c58a5aa0a0a0b07008047e8ef0fe07d';

const PREFIX_TO_TABLE = {
	[DEFECT_PREFIX]: DEFECT,
	[PRB_PREFIX]: PRB,
	[STRY_PREFIX]: STRY
};

const getConfig = branch => {
	let task = branch.match(prbMatch);
	if (task)
		return {
			url: api.urls.PRB_URL,
			table: PRB,
			queryParams: {
				sysparm_search: task,
				sysparm_groups: TASK
			},
			responseHandler: prbResponseHandler
		};

	task = branch.match(defectMatch);
	if (task)
		return {
			url: api.urls.BT1_URL,
			table: DEFECT,
			queryParams: {
				sysparm_search: task,
				sysparm_groups: TASK
			},
			responseHandler: responseBaseHandler
		};

	task = branch.match(stryMatch);
	if (task)
		return {
			url: api.urls.BT1_URL,
			table: STRY,
			queryParams: {
				sysparm_search: task,
				sysparm_groups: TASK
			},
			responseHandler: responseBaseHandler
		};

	return {};
};

module.exports = getConfig;
