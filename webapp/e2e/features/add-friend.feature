Feature: Adding a friend

Scenario: The user can add a friend
  Given A logged-in user and another user
  When I add the user as a friend
  Then The user should disappear from the Users page