Feature: Register Duplicate User
 Scenario: Register Duplicate User scenario
    When I call register user api with already registered user.
    Then I should get error message in response as "An account already exists with this email. Please login."
    Then errorcode in response should be "accountExist"
