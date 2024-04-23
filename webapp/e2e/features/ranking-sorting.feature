Feature: Seeing ranking and changing sorting filter

Scenario: The user can see the Ranking page and change sorting filter
  Given A logged-in user
  When I click on the Ranking link and in Sort by Total Points
  Then The ranking (sorted by Total Points) should be shown on screen