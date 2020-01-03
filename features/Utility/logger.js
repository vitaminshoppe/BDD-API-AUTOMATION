var log4js = require('log4js');
var Logger = function(pOptions){
	this.options = pOptions;
	this.getLogger = function(){
		log4js.configure({
			appenders: {
				'file': {
					type: 'file', filename: this.options.fileName
				},
				'console': {
				type: 'console'
				}
			},
			categories: {
				default: {
					appenders: ['file', 'console'], level: this.options.level
				}
			}
		});
		return log4js.getLogger();
	}
}

module.exports = Logger;
