const { fetch } = require("cross-fetch");

class GenericGenerator {
  constructor(entity, props, preguntas) {
    this.entity = entity;
    this.props = props;
    this.propLabels = this.#generateLabels(props).map(x => x.slice(1).trimEnd());
    this.preguntas = preguntas;
    this.preguntasMap = this.#generateQuestionLabels(preguntas);

    Array.prototype.groupByEntity = function () {
      return this.reduce((acumulador, actual) => {
        const entity = actual.entityLabel.value;
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
  async #getData() {
    const sparqlQuery = `
            SELECT DISTINCT ?entityLabel ${this.#generateLabels(this.props).join(' ')}
            WHERE {
                ?entity wdt:P31 wd:${this.entity};            
                    ${this.#generateProps(this.props)} .
                SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es" }
            }
        `;

    const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(
      sparqlQuery
    )}&format=json`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      return data.results.bindings.groupByEntity();
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  }

  async generateRandomQuestion(data) {
    // Elegir aleatoriamente un país del array
    var entidades = Object.keys(data);
    const entidadLabel =
      entidades[Math.floor(Math.random() * entidades.length)];
    //Eliminar la entidad de la lista de entidades
    entidades = entidades.filter((x) => x !== entidadLabel);
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
      this.preguntasMap.get(propiedadPregunta) + entidadLabel;

    return questionObj;
  }

  async generateRandomQuestions(n) {
    if(!this.data){
      this.data = await this.#getData(this.entity, this.props);
    }
    if (this.data.length === 0) {
      console.log("No se pudo obtener datos para generar preguntas.");
      return;
    }

    const questions = [];

    for (let i = 0; i < n; i++) {
      const question = Promise.resolve(this.generateRandomQuestion(this.data));
      questions.push(question);
    }

    return Promise.all(questions);
  }
}

entity = "Q6256"
props = ["P36", "P35", "P1344", "P37", "P47", "P2250", "P571", "P122", "P1451"]
preguntas = [
    "¿Cuál es la capital de ", 
    "¿Quién es el jefe de estado de ",
    "¿En qué evento histórico participó ",
    "¿Cuál es uno de los idiomas oficiales de ",
    "¿Con qué país comparte frontera ",
    "¿Cuál es la esperanza de vida media de ",
    "¿En qué fecha se fundó ",
    "¿Cuál es la forma de gobierno de ",
    "¿Cuál es el lema de "
]

var gen = new GenericGenerator(entity, props, preguntas)
gen.generateRandomQuestions(5)
    .then(questions => {
        console.log(questions);
    })
    .catch(error => console.error("Error generando preguntas:", error));