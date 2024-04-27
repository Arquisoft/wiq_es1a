const GenericGenerator = require("./GenericGenerator");
const fs = require("fs");

class GeneratorChooser {
  constructor() {
    this.generators = new Map();
    this.topics = [];
    this.read_json("./data/topics.json");
  }

  read_json(ruta) {
    const datos = fs.readFileSync(ruta);
    var topics = JSON.parse(datos);

    for (let i in topics) {
      var topic = topics[i];
      this.topics.push(i);
      this.generators.set(
        i,
        new GenericGenerator(
          topic.entity,
          topic.props,
          topic.types,
          topic.preguntas
        )
      );
    }
  }

  getQuestions(topic, n, locale) {
    if (topic === "all") {
      var questions = [];
      for (let i = 0; i < n; i++) {
        let rand = Math.floor(Math.random() * this.topics.length);
        let randTopic = this.topics[rand];
        let q = this.generators.get(randTopic).generateRandomQuestions(1, locale);
        questions.push(q);
      }
      return questions.flat();
    } else {
      return this.generators.get(topic).generateRandomQuestions(n, locale);
    }
  }

  getQuestionsPost(topics, n, locale) {
    var questions = [];
    for (let i = 0; i < n; i++) {
      let rand = Math.floor(Math.random() * topics.length);
      let randTopic = topics[rand];
      let q = this.generators.get(randTopic).generateRandomQuestions(1, locale);
      questions.push(q);
    }
    return questions.flat();
  }

  async loadGenerators() {
    for (let i = 0; i < this.topics.length; i++) {
      var gen = this.generators.get(this.topics[i]);
      console.log("Loading topic: " + this.topics[i]);
      await gen.getData();
      await this.#sleep(10000);
    }
  }

  #sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

module.exports = GeneratorChooser;
