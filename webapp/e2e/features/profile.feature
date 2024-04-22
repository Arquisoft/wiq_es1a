Feature: Seeing logged user's profile

Scenario: The user can see his Profile page
  Given A logged-in user
  When I click on the Profile link
  Then The user's profile shoud be shown on screen