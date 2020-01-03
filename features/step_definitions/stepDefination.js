'use strict';
const chai = require('chai');
var expect = chai.expect;
global.assert = require('chai').assert;
var Data = require('../Data/cart.json')
var userRegisterData = require('../Data/registerUser.json')
var addressData = require('../Data/addContactInfo.json')
var dbService = require('../service/database.service');
var jsonUtility = require('../utility/json.util');
var substitutor = require('../utility/substitutor');
var RestClient = require('../client/rest-client');
var restClient = new RestClient();
var config = require('../config');
var path = require('path');
var filesUtil = require('../utility/file.util');
var getLastLine = filesUtil.getLastLine;
var fs = require('fs');
var { Given } = require('cucumber');
var { When } = require('cucumber');
var { Then } = require('cucumber');
var { Before } = require('cucumber');
var { setDefaultTimeout } = require('cucumber');
var Logger = require('../utility/logger');
global.incrementedCount = (new Date()).getTime();
global.logger = (new Logger(config.loggerConfig)).getLogger();
global.app = {};
global.app.random = global.incrementedCount;

Before(function () {
  setDefaultTimeout(60 * 1000);
});

When(/^I call add to cart api with skuID = "([^"]*)"$/, function (arg1, callback) {
  let k;

  Data.updateRequestBodyFields.forEach(function (element, index) {
    k = jsonUtility.setNested(Data.requestBody, element, ".", arg1);
  });
  makeRequestCall(Data, k).then(function (response) {
    callback();
  })
});

Then('product should be added to cart with amount= {string} and quantity {string}', function (arg1, arg2, callback) {
  this.attach(JSON.stringify(global.lastApiResponse.body),'application/json')
  let amount = jsonUtility.getNested(global.lastApiResponse.body, "estimatedCartSummaryPrice", ".");
  let quantity = jsonUtility.getNested(global.lastApiResponse.body, "commerceItems[0].quantity", ".");
  expect(amount).to.equal(parseFloat(arg1))
  expect(quantity).to.equal(parseFloat(arg2))
  callback();
});

Then(/^product should be added to cart with skuID = "(.*)"$/, function (p1, callback) {
  ;
  let skuID = jsonUtility.getNested(global.lastApiResponse.body, "commerceItems[0].skuId", ".");
  expect(skuID).to.equal(p1)
  callback();
});

When(/^I call add addess to account api$/, function (callback) {
  let authFile = require(path.resolve(config.testDirectoryPath + '/reg-auth.json'));
  restClient.authenticate(authFile).then((ack) => {
    makeRequestCall(addressData, addressData.requestBody, ack).then(function (response) {
      callback();
    })
  });


});

Then(/^response should received as success$/, function (callback) {
  expect(jsonUtility.getNested(global.lastApiResponse.body, "response", ".")).to.equal("success")
  createRegAuthFile()
  this.attach(JSON.stringify(global.lastApiResponse.body),'application/json')
  callback();
});

When(/^I call register user api with firstname as "([^"]*)" and lastName as "([^"]*)"$/, function (arg1, arg2, callback) {
  let requestBodyModified
  let emailField = jsonUtility.getNested(userRegisterData.requestBody, userRegisterData.updateRequestBodyFields[0], ".");
  requestBodyModified = jsonUtility.setNested(userRegisterData.requestBody, userRegisterData.updateRequestBodyFields[0], ".", substitutor(emailField, global.app));
  requestBodyModified = jsonUtility.setNested(requestBodyModified, userRegisterData.updateRequestBodyFields[1], ".", arg1);
  requestBodyModified = jsonUtility.setNested(requestBodyModified, userRegisterData.updateRequestBodyFields[2], ".", arg2);
  logger.info("Registering user ", requestBodyModified, global.app)
  makeRequestCall(userRegisterData, requestBodyModified).then(function (response) {
    writeUsersRegistrationLogFile(jsonUtility.getNested(requestBodyModified, "email", "."), jsonUtility.getNested(requestBodyModified, "password", "."), jsonUtility.getNested(response.body.registerResponse, "profileId", "."))
    callback();
  })

});
Then(/^firstname and lastName in response should be "([^"]*)" and "([^"]*)"$/, function (arg1, arg2, callback) {
  this.attach(JSON.stringify(global.lastApiResponse.body),'application/json')
  let firstName = jsonUtility.getNested(global.lastApiResponse.body.registerResponse, "firstName", ".");
  let lastName = jsonUtility.getNested(global.lastApiResponse.body.registerResponse, "lastName", ".");
  expect(firstName).to.equal(arg1)
  expect(lastName).to.equal(arg2)
  callback();
});

Then(/^status flag in response should be "([^"]*)"$/, function (arg1, callback) {
  let status = jsonUtility.getNested(global.lastApiResponse.body.registerResponse, "STATUS", ".");
  expect(status).to.equal(arg1)
  callback();
});

Then(/^firstname and lastName in database should match with response$/, function (callback) {
  let db;
  userRegisterData.updateQueryFields.forEach(function (element, index) {
    let requestField = jsonUtility.getNested(userRegisterData.verification.dbVerification, element, ".");
    db = jsonUtility.setNested(userRegisterData.verification.dbVerification, element, ".", substitutor(requestField, global.app));
  });
  dbService.fetchData(db)
    .then((dbResp) => {
      logger.info("db response is ", JSON.stringify(dbResp, null, 2))
      this.attach(JSON.stringify(dbResp),'application/json')
      let firstNameDb = jsonUtility.getNested(dbResp[0], "FIRST_NAME", ".");
      let lastNameDb = jsonUtility.getNested(dbResp[0], "LAST_NAME", ".");
      let firstNameResponse = jsonUtility.getNested(global.lastApiResponse.body.registerResponse, "firstName", ".");
      let lastNameResponse = jsonUtility.getNested(global.lastApiResponse.body.registerResponse, "lastName", ".");
      expect(firstNameDb).to.equal(firstNameResponse)
      expect(lastNameDb).to.equal(lastNameResponse)
      callback();
    })

});

When('I call register user api with already registered user.', function (callback) {
  let requestBodyModified
  let emailField = jsonUtility.getNested(userRegisterData.requestBody, userRegisterData.updateRequestBodyFields[0], ".");
  requestBodyModified = jsonUtility.setNested(userRegisterData.requestBody, userRegisterData.updateRequestBodyFields[0], ".", substitutor(emailField, global.app));
  logger.info("Registering user ", requestBodyModified, global.app)
  makeRequestCall(userRegisterData, requestBodyModified).then(function (response) {
    callback();
  })
});

Then('I should get error message in response as {string}', function (expectedMessage, callback) {
  this.attach(JSON.stringify(global.lastApiResponse.body),'application/json')
  let errorMessage = jsonUtility.getNested(global.lastApiResponse.body, "errors[0].errorMessage", ".");
  expect(errorMessage).to.equal(expectedMessage)
  callback();
});

Then('errorcode in response should be {string}', function (expectedAccountCode, callback) {
  let errorCode = jsonUtility.getNested(global.lastApiResponse.body, "errors[0].errorCode", ".");
  expect(errorCode).to.equal(expectedAccountCode)
  callback();
});

function makeRequestCall(testSpec, requestBody, cookie = '') {
  try {
    return restClient[testSpec.method.toLowerCase()](testSpec, requestBody, cookie);
  } catch (e) {
    logger.error(e);
  }
}

function createRegAuthFile() {
  return getLastLine(config.storeDetailsDirectoryPath + '/users', 1)
    .then((lastLine) => {
      var newAuthFile;
      try {
        newAuthFile = JSON.parse(JSON.stringify(require(path.resolve(config.testDirectoryPath + '/auth.json'))));
      } catch (e) {
        logger.error(e)
        throw new Error("Auth file is mandatory in test folder");
      }
      var regUserDetail = lastLine.split(',');
      let regUser = {};
      regUserDetail.forEach(function (element, index) {
        let data = element.split('=');
        regUser[data[0]] = data[1];
      });
      newAuthFile.requestBody.email = regUser.email;
      newAuthFile.requestBody.password = regUser.password;
      writeContentToFile(path.resolve(config.testDirectoryPath + '/reg-auth.json'), JSON.stringify(newAuthFile, null, 2));
    })
    .catch((err) => {
      throw new Error(err.message)
    })
}
function writeUsersRegistrationLogFile(newEmail, password, profileId) {
  fs.appendFileSync(path.resolve(config.storeDetailsDirectoryPath, 'users'),
    "email=" + newEmail + "," +
    "password=" + password + "," +
    "id=" + profileId + "\r\n",
    "utf-8");

  return createRegAuthFile()
    .then(() => { })
    .catch((err) => {
      throw new Error(err.message);
    })
}
function writeContentToFile(filePath, content) {
  fs.writeFileSync(path.resolve(filePath), content);
  return;
}
