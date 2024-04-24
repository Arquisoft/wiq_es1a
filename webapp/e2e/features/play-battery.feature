Feature: Answering a question

Scenario: The user can answer a question on Battery mode
  Given A logged-in user
  When I play on Battery mode and click on an answer
  Then The next question should be loaded on screen