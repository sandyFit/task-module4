Scenario: Add a product to Favorites
    Given the user is logged in
    And is in the Product Details page
    When the user clicks the Add to Favourites button
    Then the product should be added to the user’s favorites list
    And a successful message should appear
