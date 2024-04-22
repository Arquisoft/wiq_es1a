Feature: Seeing logged user's profile

Scenario: The user can view the Configuration page
  Given A logged-in user
  When I click on the Configuration link
  Then The Configuration page should be shown on screen