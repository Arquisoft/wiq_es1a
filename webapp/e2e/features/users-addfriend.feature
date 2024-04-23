Feature: Adding a new friend

Scenario: The user can add a friend
  Given A logged-in user
  When I click on the Users link and add a friend
  Then The user should disappear from the Users page