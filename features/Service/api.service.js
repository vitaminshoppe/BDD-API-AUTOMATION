var request = require('request');
var _ = require('lodash');
let url = require('url');
var env = require('../support/env')

/**
 * [_vsiApiGET A util function that returns the response of the get request of the provided URL]
 * @param  {String} url     [The request URL]
 * @param  {String} cookie  [Cookie after logged in]
 * @param  {Number} timeout [Make the call only after specified time]
 * @return {Promise}         [the response of the API]
 */
var _vsiApiGET = function (options, responseLoggerObject, timeout = 0) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      var getOption = {
        url: options.url,
        headers: {
          'Cookie': options.cookie
        },
        json: true
      };
      if (options.headers) {
        getOption.headers = _.merge(getOption.headers, options.headers);
      }
      request.get(getOption, function (apiErr, apiResp, apiBody) {
        if (apiErr) {
          reject(apiErr);
        }
        else {
          global.lastApiResponse = apiResp
          logger.info("Api Response for url " + postOption.url + "\r\n" + JSON.stringify(global.lastApiResponse.body))
          responseLoggerObject.attach(JSON.stringify(global.lastApiResponse.body), 'application/json')
          resolve(apiResp);
        }
      });
    }, timeout);
  });
};


/**
 * [_vsiApiGET A util function that returns the response of the get request of the provided URL]
 * @param  {String} url     [The request URL]
 * @param  {String} cookie  [Cookie after logged in]
 * @param  {Number} timeout [Make the call only after specified time]
 * @return {Promise}         [the response of the API]
 */
var _vsiApiPOST = function (options, responseLoggerObject, timeout = 0) {
  logger.info("API Url", options.url);
  logger.info("Request body", options.body);
  let postOption = {
    url: options.url,
    headers: {
      'Cookie': options.cookie
    },
    body: options.body,
    json: true
  };
  if (options.headers) {
    postOption.headers = _.merge(postOption.headers, options.headers);
  }
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      request.post(postOption, function (apiErr, apiResp, apiBody) {
        if (apiErr) {
          reject(apiErr);
        } else {
          global.lastApiResponse = apiResp
          logger.info("Api Response for url " + postOption.url + "\r\n" + JSON.stringify(global.lastApiResponse.body))
          responseLoggerObject.attach(JSON.stringify(global.lastApiResponse.body), 'application/json')
          resolve(apiResp);
        }
      });
    }, timeout);
  });
};



/**
 * [Checks if the URL is of the application or of third party and returns the generated complete url]
 * @return {String} [URL]
 */
function getCompleteURL(urlObj) {
  return url.resolve(env.BASE_URL, urlObj);
}




exports._vsiApiGET = _vsiApiGET;
exports._vsiApiPOST = _vsiApiPOST;
exports.getCompleteURL = getCompleteURL;