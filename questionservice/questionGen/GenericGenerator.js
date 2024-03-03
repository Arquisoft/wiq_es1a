const axios = require("axios");

class GenericGenerator {
  constructor(entity, props, types, preguntas) {
    this.entity = entity;
    this.props = props;
    this.types = types;
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
        this.data = data.results.bindings.groupByEntity();
      })
      .catch((error) => {
        console.error("Error fetching data: " + error.message);
      });
  }

  generateRandomQuestion() {
    // Elegir aleatoriamente una entidad del array
    var entidades = Object.keys(this.data);
    const entidadLabel =
      entidades[Math.floor(Math.random() * entidades.length)];

    const entidad = this.data[entidadLabel];

    // Elegir aleatoriamente una propiedad de la entidad para hacer la pregunta
    const propiedades = this.propLabels;

    var respuestaCorrecta = "";
    var propIndex = 0;
    do{
      propIndex = Math.floor(Math.random() * propiedades.length);
      var propiedadPregunta = propiedades[propIndex];

      // Obtener la respuesta correcta
      respuestaCorrecta =
        entidad[propiedadPregunta][entidad[propiedadPregunta].length - 1];
    }while(/^Q\d+/.test(respuestaCorrecta));

    var questionObj = {
      pregunta: "",
      respuestas: [respuestaCorrecta],
      correcta: respuestaCorrecta
    };

    // Obtener respuestas incorrectas
    while (questionObj.respuestas.length < 4) {
      const otroPaisLabel =
        entidades[Math.floor(Math.random() * entidades.length)];
      const otroPais = this.data[otroPaisLabel];
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

    switch(this.types[propIndex]){
      case "date":
        questionObj.respuestas = questionObj.respuestas.map(x => this.#dateFormatter(x));
        questionObj.correcta = this.#dateFormatter(questionObj.correcta);
        break;
      case "num":
        questionObj.respuestas = questionObj.respuestas.map(x => Math.floor(x));
        questionObj.correcta = Math.floor(questionObj.correcta);
        break;
      case "photo":
        questionObj.respuestas = questionObj.respuestas.map(x => this.#photoFormatter(x));
        questionObj.correcta = this.#photoFormatter(questionObj.correcta);
        break;
      default:
        break;
    }

    questionObj.pregunta =
      this.preguntasMap.get(propiedadPregunta) + entidadLabel + "?";

    return questionObj;
  }

  generateRandomQuestions(n) {
    const questions = [];

    for (let i = 0; i < n; i++) {
      const question = this.generateRandomQuestion();
      questions.push(question);
    }

    return questions;
  }

  #dateFormatter(fecha) {
    var isAC = false;
    if(fecha.startsWith('-')){
        isAC = true;
        fecha = fecha.substring(1);
    }

    const [año, mes, dia] = fecha.split('T')[0].split('-').map(n => Number.parseInt(n).toFixed());

    const fechaFormateada = `${dia}/${mes}/${año}${isAC ? ' a.C.' : ''}`;
    
    return fechaFormateada;
  }

  #photoFormatter(photo){
    return `<a href="${photo}" ></a>`;
  }

}

module.exports = GenericGenerator;
