Feature: Seeing logged user's profile

Scenario: The user is logged in and can view their profile
  Given A logged-in user
  When I press the Profile link
  Then The user's profile shoud be shown on screen