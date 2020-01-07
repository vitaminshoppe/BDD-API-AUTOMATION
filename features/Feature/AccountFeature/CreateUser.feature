Feature: Register User
 Scenario: Create new user scenario
    When I call register user api with firstname as "Jhon" and lastName as "Doe"
    Then firstname and lastName in response should be "Jhon" and "Doe"
    Then status flag in response should be "SUCCESS_CREATE_CUSTOMER"
    Then firstname and lastName in database should match with response
    Then JSON schema should match the expected schema.

