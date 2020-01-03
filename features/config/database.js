let path = require('path')
//let dotEnvPath = path.resolve('.env')

/**
 * since mocha don't see enviroment variables we have to use dotenv
 */
//require('dotenv').config({ path: dotEnvPath })

module.exports= {
	web03: {
		/**
		 * [baseUrl Base url of the application for the environment https://www.example.com/]
		 * @type {String}
		 */
		baseUrl: process.env.DATABASE_URL_WEB03,

		/**
		 * [databaseCreds Database credentials]
		 * @type {Object}
		 */
		databaseCreds: {
			user          : "",
		    password      : "",
		    connectString : ""
		},

		/**
		 * [tableConfig Table/Collection names for of the entities]
		 * @type {Object}
		 */
		tableConfig: {

			/**
			 * [profile Table/Collection name of profile in database]
			 * @type {String}
			 */
			dbName: "",
			profile: "VSX_DPS_USER",
			product: "",
			orders: ""
		},
	},
	perf: {
		/**
		 * [baseUrl Base url of the application for the environment]
		 * @type {String}
		 */
		baseUrl: "",

		/**
		 * [databaseCreds Database credentials]
		 * @type {Object}
		 */
		databaseCreds: {
            /* Below credential is for perf env */
			/*user          : "sgopalan",
		    password      : "s90pa1an",
		    connectString : "10.102.133.230:1527/PERFTEST"*/
            /* Below credential is for qa1 env */
            user            : "core",
            password        : "core",
            connectString   : "vsi-dev-chi-db-01-p.int.sparkred.com:1521/vsidev1.sparkred.com"
		},

		//dbName: "P_PRDATGCOMM",  // DB name or schema for perf
		dbName: "CORE",            // DB name or schema for QA1
		/**
		 * [tableConfig Table/Collection names for of the entities]
		 * @type {Object}
		 */
		tableConfig: {

			/**
			 * [profile Table/Collection name of profile in database]
			 * @type {String}
			 */
			profile: "VSX_DPS_USER",
			address: "DPS_CONTACT_INFO",
			otherAddress: "DPS_OTHER_ADDR",
			userAddress: "DPS_USER_ADDRESS",
			product: "",
			orders: "",
			item: "DCSPP_ITEM",
			order: "VSX_DCSPP_ORDER"
		}
	}
}
