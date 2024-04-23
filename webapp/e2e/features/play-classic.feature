Feature: Answering a question

Scenario: The user can answer a question
  Given A logged-in user
  When I play on Classic mode and click on an answer
  Then The right answer should be colored green