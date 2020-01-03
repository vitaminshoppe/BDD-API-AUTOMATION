let dbConfig = require('../config/database.js');
var oracledb = require('oracledb');

//Required Output format..
oracledb.outFormat = oracledb.OBJECT;

exports.fetchData = function (config) {
	return new Promise((resolve, reject) => {
		// Get a non-pooled connection
		oracledb.getConnection(dbConfig.perf.databaseCreds,
			function (err, connection) {
				if (err) {
					logger.error(err);
					return reject(err);
				}
				logger.info("Connection successful");
				let query = config.query;
				logger.info(`QUERY is :::::: ${query}`)
				connection.execute(
					query,
					function (err, result) {
						if (err) {
							logger.error(err);
							reject(err);
							doRelease(connection);
							return;
						}
						resolve(result.rows);
						doRelease(connection);
					});
			});
	});
}


// Note: connections should always be released when not needed
function doRelease(connection) {
	connection.close(
		function (err) {
			if (err) {
				logger.error(err);
			}
		});
}