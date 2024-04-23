Feature: Seeing logged user's stats and changing gamemode

Scenario: The user can see his Stats page and change gamemode
  Given A logged-in user
  When I click on the Stats link and in Calculator gamemode
  Then The user's stats in Calculator gamemode shoud be shown on screen