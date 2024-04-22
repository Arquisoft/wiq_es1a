Feature: Seeing logged user's profile

Scenario: The user can view the History page
  Given A logged-in user
  When I click on the History link
  Then The History page should be shown on screen