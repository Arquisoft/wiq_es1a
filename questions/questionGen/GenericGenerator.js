const axios = require("axios");

class GenericGenerator {
  constructor(entity, props, preguntas) {
    this.entity = entity;
    this.props = props;
    this.propLabels = this.#generateLabels(props).map((x) =>
      x.slice(1).trimEnd()
    );
    this.preguntas = preguntas;
    this.preguntasMap = this.#generateQuestionLabels(preguntas);

    Array.prototype.groupByEntity = function () {
      return this.reduce((acumulador, actual) => {
        const entity = actual.entityLabel.value;
        if (!/^Q\d+/.test(entity)) {
          if (!acumulador[entity]) {
            acumulador[entity] = {};
          }

          for (const key in actual) {
            if (key !== "entityLabel") {
              const valor = actual[key].value;
              if (!acumulador[entity][key]) {
                acumulador[entity][key] = [valor];
              } else if (!acumulador[entity][key].includes(valor)) {
                acumulador[entity][key].push(valor);
              }
            }
          }
        }

        return acumulador;
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

  // Función para realizar la consulta SPARQL y obtener los datos de Wikidata
  async getData() {
    const sparqlQuery = `
              SELECT DISTINCT ?entityLabel ${this.#generateLabels(
                this.props
              ).join(" ")}
              WHERE {
                  ?entity wdt:P31 wd:${this.entity};            
                      ${this.#generateProps(this.props)} .
                  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es" }
              }
              LIMIT 10000
          `;

    const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(
      sparqlQuery
    )}&format=json`;

    await axios
      .get(url)
      .then((response) => {
        const data = response.data;
        console.log(data);
        this.data = data.results.bindings.groupByEntity();
      })
      .catch((error) => {
        console.error("Error fetching data: " + error.message);
      });
  }

  generateRandomQuestion(data) {
    // Elegir aleatoriamente una entidad del array
    var entidades = Object.keys(data);
    const entidadLabel =
      entidades[Math.floor(Math.random() * entidades.length)];

    const entidad = data[entidadLabel];

    // Elegir aleatoriamente una propiedad de la entidad para hacer la pregunta
    const propiedades = this.propLabels;
    const propiedadPregunta =
      propiedades[Math.floor(Math.random() * propiedades.length)];

    // Obtener la respuesta correcta
    const respuestaCorrecta =
      entidad[propiedadPregunta][entidad[propiedadPregunta].length - 1];

    var questionObj = {
      pregunta: "",
      respuestas: [respuestaCorrecta],
      correcta: respuestaCorrecta,
    };

    // Obtener respuestas incorrectas
    while (questionObj.respuestas.length < 4) {
      const otroPaisLabel =
        entidades[Math.floor(Math.random() * entidades.length)];
      const otroPais = data[otroPaisLabel];
      let prop = otroPais[propiedadPregunta][0];

      // Si no está en las propiedades de la entidad de la pregunta
      if (
        !questionObj.respuestas.includes(prop) &&
        !entidad[propiedadPregunta].includes(prop) &&
        !/^Q\d+/.test(prop)
      ) {
        questionObj.respuestas.push(prop);
      }
    }

    // Barajar las opciones de respuesta
    questionObj.respuestas.sort(() => Math.random() - 0.5);

    questionObj.pregunta =
      this.preguntasMap.get(propiedadPregunta) + entidadLabel + "?";

    return questionObj;
  }

  generateRandomQuestions(n) {
    const questions = [];

    for (let i = 0; i < n; i++) {
      const question = this.generateRandomQuestion(this.data);
      questions.push(question);
    }

    return questions;
  }
}

module.exports = GenericGenerator;
