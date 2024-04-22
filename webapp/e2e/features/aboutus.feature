Feature: Seeing logged user's profile

Scenario: The user can view the about us page
  Given A logged-in user
  When I click on the About Us link
  Then The About Us page should be shown on screen