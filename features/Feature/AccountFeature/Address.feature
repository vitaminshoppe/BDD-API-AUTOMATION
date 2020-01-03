Feature: Account
 Scenario: Add address in account
    When I call add addess to account api
    Then response should received as success
