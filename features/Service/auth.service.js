let apiService = require('./api.service');
let cookie = '';

var getCookie = function (currentCookie, setCookie) {
    for (var i = 0; i < setCookie.length; i++) {
        currentCookie += setCookie[i] + ';';
    }
    console.log("Current Cookie: " + currentCookie);
    return currentCookie;
};

function replacer(key, value) {
    // Filtering out properties
    if (key.includes("password") || key.includes("pwd")) {
        return undefined;
    }
    return value;
}

var authenticate = function (authConfig) {

    if (authConfig.method === 'post') {
        logger.info("Authenticating with below details:", JSON.stringify(authConfig.requestBody, replacer, 2))
        return apiService._vsiApiPOST({
            url: apiService.getCompleteURL(authConfig.url),
            body: authConfig.requestBody,
            cookie: cookie
        }).then((response) => {
            if (response)
                cookie = getCookie(cookie, response.headers['set-cookie']);
            return cookie;
        });
    }

    throw new Error("Please provide a valid request method");
}

exports.authenticate = authenticate;
