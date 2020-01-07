'use strict';
const chai = require('chai');
var expect = chai.expect;
global.assert = require('chai').assert;
var Data = require('../Data/addToCart.json')
var removeCartData = require('../Data/removeFromCart.json')
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
const Ajv = require('ajv');
const ajv = new Ajv({
  allErrors: true,
});
var Logger = require('../utility/logger');
global.incrementedCount = (new Date()).getTime();
global.logger = (new Logger(config.loggerConfig)).getLogger();
global.app = {};
global.app.random = global.incrementedCount;
var loginCookie = {};

Before(function () {
  setDefaultTimeout(10 * 1000);
});

When(/^I call add to cart api with skuID = "([^"]*)"$/, function (arg1, callback) {
  let k;

  Data.updateRequestBodyFields.forEach(function (element, index) {
    k = jsonUtility.setNested(Data.requestBody, element, ".", arg1);
  });
  makeRequestCall(Data, k, loginCookie, this).then(function (response) {
    global.commerceId = jsonUtility.getNested(global.lastApiResponse.body, "commerceItems[0].commerceId", ".");
    callback();
  })
});

Then('product {string} should be added to cart with amount= {string} and quantity {string}', function (productNo, arg1, arg2, callback) {
  let amount = jsonUtility.getNested(global.lastApiResponse.body, "commerceItems[" + productNo + "].priceInfo", ".");
  let quantity = jsonUtility.getNested(global.lastApiResponse.body, "commerceItems[" + productNo + "].quantity", ".");
  expect(amount).to.equal(parseFloat(arg1))
  expect(quantity).to.equal(parseFloat(arg2))
  callback();
});

Then('product {string} should be added to cart with skuID = {string}', function (productNo, p1, callback) {
  let skuID = jsonUtility.getNested(global.lastApiResponse.body, "commerceItems[" + productNo + "].skuId", ".");
  expect(skuID).to.equal(p1)
  callback();
});

When(/^I call add addess to account api$/, function (callback) {
  let authFile = require(path.resolve(config.testDirectoryPath + '/reg-auth.json'));
  restClient.authenticate(authFile, this).then((ack) => {
    loginCookie = ack;
    makeRequestCall(addressData, addressData.requestBody, ack, this).then(function (response) {
      callback();
    })
  });


});

Then(/^response should received as success$/, function (callback) {
  expect(jsonUtility.getNested(global.lastApiResponse.body, "response", ".")).to.equal("success")
  createRegAuthFile()
  callback();
});

When(/^I call register user api with firstname as "([^"]*)" and lastName as "([^"]*)"$/, function (arg1, arg2, callback) {
  let requestBodyModified
  let emailField = jsonUtility.getNested(userRegisterData.requestBody, userRegisterData.updateRequestBodyFields[0], ".");
  requestBodyModified = jsonUtility.setNested(userRegisterData.requestBody, userRegisterData.updateRequestBodyFields[0], ".", substitutor(emailField, global.app));
  requestBodyModified = jsonUtility.setNested(requestBodyModified, userRegisterData.updateRequestBodyFields[1], ".", arg1);
  requestBodyModified = jsonUtility.setNested(requestBodyModified, userRegisterData.updateRequestBodyFields[2], ".", arg2);
  logger.info("Registering user ", requestBodyModified, global.app)
  makeRequestCall(userRegisterData, requestBodyModified, '', this).then(function (response) {
    writeUsersRegistrationLogFile(jsonUtility.getNested(requestBodyModified, "email", "."), jsonUtility.getNested(requestBodyModified, "password", "."), jsonUtility.getNested(response.body.registerResponse, "profileId", "."))
    callback();
  })
});
Then('JSON schema should match the expected schema.', function (callback) {
  validateSchema(userRegisterData.schema, global.lastApiResponse.body, this)
  callback();
});
Then(/^firstname and lastName in response should be "([^"]*)" and "([^"]*)"$/, function (arg1, arg2, callback) {
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
  makeRequestCall(userRegisterData, requestBodyModified, '', this).then(function (response) {
    callback();
  })
});

Then('I should get error message in response as {string}', function (expectedMessage, callback) {
  let errorMessage = jsonUtility.getNested(global.lastApiResponse.body, "errors[0].errorMessage", ".");
  expect(errorMessage).to.equal(expectedMessage)
  callback();
});

Then('errorcode in response should be {string}', function (expectedAccountCode, callback) {
  let errorCode = jsonUtility.getNested(global.lastApiResponse.body, "errors[0].errorCode", ".");
  expect(errorCode).to.equal(expectedAccountCode)
  callback();
});

When('I call remove from cart api with valid commerceId', function (callback) {
  let requestBodyModified
  requestBodyModified = jsonUtility.setNested(removeCartData.requestBody, removeCartData.updateRequestBodyFields[0], ".", global.commerceId);
  makeRequestCall(removeCartData, requestBodyModified, loginCookie, this).then(function (response) {
    callback();
  })
});
Then('orderType in reponse should be {string}', function (expectedOrderType) {
  let orderType = jsonUtility.getNested(global.lastApiResponse.body, "orderType", ".");
  expect(orderType).to.equal(expectedOrderType)
});

Then('JSON schema for cart repponse should match the expected schema.', function (callback) {
  validateSchema(Data.schema, global.lastApiResponse.body, this)
  callback();
});

function makeRequestCall(testSpec, requestBody, cookie = '', responseLoggerObject) {
  try {
    return restClient[testSpec.method.toLowerCase()](testSpec, requestBody, cookie, responseLoggerObject);
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
function validateSchema(schemaObject, responseObject, instance) {
  let validate = ajv.compile(schemaObject);
  let valid = validate(responseObject);
  if (validate.errors) {
    logger.info("JSON Schema Errors are")
    logger.error(validate.errors);
    instance.attach(JSON.stringify(validate.errors))
    expect(validate.errors.length).to.equal(0);
  }
  else {
    logger.info("JSON Schema Validated successfully.")
  }


}
