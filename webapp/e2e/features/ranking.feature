Feature: Seeing ranking and changing gamemode

Scenario: The user can see the Ranking page and change gamemode
  Given A logged-in user
  When I click on the Ranking link and in Battery gamemode
  Then The ranking of the Battery gamemode should be shown on screen