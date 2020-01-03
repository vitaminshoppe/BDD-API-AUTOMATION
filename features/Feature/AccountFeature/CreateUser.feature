Feature: Register User
 Scenario: Create new user scenario
    When I call register user api with firstname as "Pratik" and lastName as "Patil"
    Then firstname and lastName in response should be "Pratik" and "Patil"
    Then status flag in response should be "SUCCESS_CREATE_CUSTOMER"
    Then firstname and lastName in database should match with response
