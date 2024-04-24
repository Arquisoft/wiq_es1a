Feature: Logging out

Scenario: The user can logout
  Given A logged-in user
  When I click on the Logout link
  Then The user should be logged out and the Login screen should be shown