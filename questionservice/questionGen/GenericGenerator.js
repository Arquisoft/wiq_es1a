const axios = require("axios");

// El generador hace una query a Wikidata por idioma
const LANGUAGES = ["es", "en"];

class GenericGenerator {
  constructor(entity, props, types, preguntas) {
    this.data = {};
    for (let i = 0; i < LANGUAGES.length; i++) {
      this.data[LANGUAGES[i]] = {};
    }

    this.entity = entity;
    this.props = props;
    this.types = types;
    this.propLabels = this.#generateLabels(props).map((x) =>
      x.slice(1).trimEnd()
    );
    this.preguntas = preguntas;
    this.preguntasMap = this.#generateQuestionLabels(preguntas);

    Array.prototype.groupByEntity = function () {
      return this.reduce((acc, actual) => {
        const entity = actual.entityLabel.value;
        if (!/^Q\d+/.test(entity)) {
          if (!acc[entity]) {
            acc[entity] = {};
          }

          for (const key in actual) {
            if (key !== "entityLabel") {
              const valor = actual[key].value;
              if (!acc[entity][key]) {
                acc[entity][key] = [valor];
              } else if (!acc[entity][key].includes(valor)) {
                acc[entity][key].push(valor);
              }
            }
          }
        }

        return acc;
      }, {});
    };
  }

  #generateProps(props) {
    var str = "";
    for (let i = 0; i < props.length; i++) {
      str += `wdt:${props[i]} ?property${i}; `;
    }
    return str;
  }

  #generateLabels(props) {
    var p = [];
    for (let i = 0; i < props.length; i++) {
      p.push(`?property${i}Label `);
    }
    return p;
  }

  #generateQuestionLabels(preguntas) {
    var map = new Map();
    for (let i = 0; i < preguntas.length; i++) {
      map.set(`property${i}Label`, preguntas[i]);
    }
    return map;
  }

  async getData() {
    for (let i = 0; i < LANGUAGES.length; i++) {
      const sparqlQuery = `
              SELECT DISTINCT ?entityLabel ${this.#generateLabels(
                this.props
              ).join(" ")}
              WHERE {
                  ?entity ${this.entity};            
                      ${this.#generateProps(this.props)} .
                  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],${
                    LANGUAGES[i]
                  }" }
              }
              LIMIT 10000
          `;

      var url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(
        sparqlQuery
      )}&format=json`;

      await axios
        .get(url)
        .then((response) => {
          const data = response.data;
          this.data[LANGUAGES[i]] = data.results.bindings.groupByEntity();
        })
        .catch((error) => {
          console.error("Error fetching data: " + error.monthsage);
        });
    }
  }

  generateRandomQuestion(locale) {
    // Choose a random entity
    var entities = Object.keys(this.data[locale]);
    const entityLabel =
      entities[Math.floor(Math.random() * entities.length)];

    const entity = this.data[locale][entityLabel];

    // Choose a random property
    const props = this.propLabels;

    var correctAnswer = "";
    var propIndex = 0;
    do {
      propIndex = Math.floor(Math.random() * props.length);
      var questionProp = props[propIndex];

      // Choose correct answer
      correctAnswer =
        entity[questionProp][entity[questionProp].length - 1];
    } while (/^Q\d+/.test(correctAnswer));

    var questionObj = {
      pregunta: "",
      respuestas: [correctAnswer],
      correcta: correctAnswer,
    };

    // Generate incorrect answers
    while (questionObj.respuestas.length < 4) {
      const otroPaisLabel =
        entities[Math.floor(Math.random() * entities.length)];
      const otroPais = this.data[locale][otroPaisLabel];
      let prop = otroPais[questionProp][0];

      // If the property is already in the answers array, choose another one
      if (
        !questionObj.respuestas.includes(prop) &&
        !entity[questionProp].includes(prop) &&
        !/^Q\d+/.test(prop) &&
        entityLabel != prop
      ) {
        questionObj.respuestas.push(prop);
      }
    }

    // Shuffle answers
    questionObj.respuestas.sort(() => Math.random() - 0.5);

    // Format answers
    switch (this.types[propIndex]) {
      case "date":
        questionObj.respuestas = questionObj.respuestas.map((x) =>
          this.#dateFormatter(x)
        );
        questionObj.correcta = this.#dateFormatter(questionObj.correcta);
        break;
      case "num":
        questionObj.respuestas = questionObj.respuestas.map((x) =>
          parseFloat(x).toFixed(2)
        );
        questionObj.correcta = parseFloat(questionObj.correcta).toFixed(2);
        break;
      default:
        break;
    }

    // Generate question
    questionObj.pregunta = this.preguntasMap
      .get(questionProp)
      [locale].replace("%", entityLabel);

    return questionObj;
  }

  generateRandomQuestions(n, locale) {
    const questions = [];

    for (let i = 0; i < n; i++) {
      const question = this.generateRandomQuestion(locale);
      questions.push(question);
    }

    return questions;
  }

  #dateFormatter(date) {
    var isAC = false;
    if (date.startsWith("-")) {
      isAC = true;
      date = date.substring(1);
    }

    const [year, month, day] = date
      .split("T")[0]
      .split("-")
      .map((n) => Number.parseInt(n).toFixed());

    const dateFormat = `${day}/${month}/${year}${isAC ? " a.C." : ""}`;

    return dateFormat;
  }
}

module.exports = GenericGenerator;
