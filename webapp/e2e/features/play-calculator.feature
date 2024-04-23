Feature: Answering a question

Scenario: The user can answer a question on Human Calculator mode
  Given A logged-in user
  When I play on Human Calculator mode and answer incorrectly
  Then The game ends