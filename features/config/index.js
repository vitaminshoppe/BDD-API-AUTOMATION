let appRoot = __dirname+'/../';
/*
	This is the configuration file.
 */

let path = require('path');

/**
 * [exports the configuration object]
 * @type {Object}
 */
module.exports = {
	/**
	 * [appName Application Name]
	 * @type {String}
	 */
	appName: 'vsi',

	/**
	 * [reportPath Path where the reports will be generated]
	 * @type {String}
	 */
	reportPath: path.resolve(__dirname + '/../report'),
	
	/**
	 * [appRoot root dir of app]
	 * @type {String}
	 */
	appRoot: appRoot,

	/**
	 * [testDirectoryPath  path of test directory]
	 * @type {String}
	 */
	testDirectoryPath: appRoot+"Data/",

	/**
	 * [storedDetailsDirectoryPath  path of test directory]
	 * @type {String}
	 */
	storeDetailsDirectoryPath: appRoot+"stored-details/",

	/**
	 * [loggerConfig Logging configuration]
	 * @type {Object}
	 */
	loggerConfig: {

		/**
		 * [fileName Logging file name with path]
		 * @type {String}
		 */
		fileName: path.resolve(__dirname + '/../../logs/api-script.log'),
		
		/**
		 * [level Logging level [warning, info, debug]]
		 * @type {String}
		 */
		level: 'debug',

		/**
		 * [appenders List of output destination ]
		 * @type {Array}
		 */
		appenders: ['file', 'console']
	}
}
