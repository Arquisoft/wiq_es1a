Feature: Creating a group

Scenario: The user can create a group
  Given A logged-in user
  When I click on the Groups link and create a group
  Then The confirmation message should be shown on screen