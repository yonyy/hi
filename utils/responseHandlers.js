const responseBaseHandler = ({ task, table }, response) => {
	let records = null;
	try {
		records = parsedBody.result.groups[0].search_results.filter(
			v => v.name === table
		)[0].records;
	} catch (error) {
		return null;
	}

	if (!records) return null;

	const record = records.filter(r => r.data.number.value === task)[0];
	const label = record.metadata.title;

	return label;
};

const prbResponseHandler = ({ task, table }, response) => {
	return 'Sample';
};

module.exports = {
	responseBaseHandler,
	prbResponseHandler
};
