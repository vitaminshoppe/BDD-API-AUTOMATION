Feature: CART
 Scenario Outline: Basic ADD TO CART
    When I call add to cart api with skuID = "<skuID>"
    Then product should be added to cart with amount= "<amount>" and quantity "<quantity>"
    Then product should be added to cart with skuID = "<skuID>"

    Examples:
    | skuID   | amount | | quantity |
    | 0N-1026 | 33.99 |  | 1 |
    | VTP0003 | 42.99 | | 2 |

