Feature: CART
 Scenario Outline: Basic add to cart
    When I call add to cart api with skuID = "<skuID>"
    Then product "<productNo>" should be added to cart with amount= "<amount>" and quantity "<quantity>"
    Then product "<productNo>" should be added to cart with skuID = "<skuID>"
    Then JSON schema for cart repponse should match the expected schema.

    Examples:
    | productNo | skuID | amount | quantity |
    |0| 0N-1026 | 33.99 |  1 | 
    |1| VTP0003 | 42.99 |  2 | 

 Scenario: Basic remove from cart
    When I call remove from cart api with valid commerceId
    Then orderType in reponse should be "DTC"
