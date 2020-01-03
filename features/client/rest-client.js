let apiService = require('../service/api.service');
let authService = require('../service/auth.service');

function RestClient(){
	this.cookie= '';
	this.token= '';

	this.get= function(testSpec,cookie123) {
			return apiService._vsiApiGET({
				url: apiService.getCompleteURL(testSpec),
				headers: testSpec.headers,
				cookie: cookie123
			});	
		};

	this.post= function(testSpec,requestBody,cookie123) {
			return apiService._vsiApiPOST({
				url: apiService.getCompleteURL(testSpec.url),
		    	body: requestBody,
		    	cookie: cookie123,
		    	headers: testSpec.headers
			});
		};

	this.resetClient = function(options) {
		this.cookie= '';
		this.token= '';
	}

	this.authenticate= function(config){
		let self = this;
			return authService.authenticate(config)
			.then((resp)=>{
				return self.cookie = resp;
			});
	}

}

module.exports = RestClient;
