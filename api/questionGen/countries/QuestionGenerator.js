const { fetch } = require('cross-fetch');
const { format } = require('date-fns');
const { es } = require('date-fns/locale');

Array.prototype.groupByCountry = function () {
    return this.reduce((acumulador, actual) => {
        const pais = actual.countryLabel.value;
        if (!acumulador[pais]) {
            acumulador[pais] = {};
        }

        for (const key in actual) {
            if (key !== "countryLabel") {
                const valor = actual[key].value;
            if (!acumulador[pais][key]) {
                acumulador[pais][key] = [valor];
            } else if (!acumulador[pais][key].includes(valor)) {
                acumulador[pais][key].push(valor);
            }
            }
        }

        return acumulador;
    }, {});
};

// Función para realizar la consulta SPARQL y obtener los datos
async function getData() {
    const sparqlQuery = `
        SELECT DISTINCT ?countryLabel ?capitalLabel ?jefeLabel ?eventLabel ?idiomaLabel ?fronteraLabel ?edadLabel ?fundacionLabel ?gobiernoLabel ?lemaLabel
        WHERE {
            ?country wdt:P31 wd:Q6256;            
                wdt:P36 ?capital;   
                wdt:P35 ?jefe;
                wdt:P1344 ?event;
                wdt:P37 ?idioma;
                wdt:P47 ?frontera;
                wdt:P2250 ?edad;
                wdt:P571 ?fundacion;
                wdt:P122 ?gobierno;
                wdt:P1451 ?lema .
            SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es" }
        }
    `;

    const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(sparqlQuery)}&format=json`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.results.bindings.groupByCountry();
    } catch (error) {
        console.error("Error fetching data:", error);
        return [];
    }
}

async function generateRandomQuestion(data) {
    // Elegir aleatoriamente un país del array
    var entidades = Object.keys(data);
    const entidadLabel = entidades[Math.floor(Math.random() * entidades.length)];
    //Eliminar el país de la lista de países
    entidades = entidades.filter(x => x !== entidadLabel);  
    const entidad = data[entidadLabel];
  
    // Elegir aleatoriamente una propiedad del país para hacer la pregunta
    const propiedades = ["capitalLabel", "jefeLabel", "eventLabel", "idiomaLabel", "fronteraLabel", "lemaLabel", "edadLabel", "fundacionLabel", "gobiernoLabel"];
    const propiedadPregunta = propiedades[Math.floor(Math.random() * propiedades.length)];
  
    // Obtener la respuesta correcta
    const respuestaCorrecta = entidad[propiedadPregunta][entidad[propiedadPregunta].length - 1];
  
    var questionObj = {
        pregunta: "",
        respuestas: [respuestaCorrecta],
        correcta: respuestaCorrecta
    }

    // Obtener respuestas incorrectas
    while (questionObj.respuestas.length < 4){
        const otroPaisLabel = entidades[Math.floor(Math.random() * entidades.length)];
        const otroPais = data[otroPaisLabel];
        let prop = otroPais[propiedadPregunta][0];

        // Si no está en las propiedades del país de la pregunta
        if(!questionObj.respuestas.includes(prop) && !entidad[propiedadPregunta].includes(prop) && !/^Q\d+/.test(prop)){
            questionObj.respuestas.push(prop)
        }
    }
  
    // Barajar las opciones de respuesta
    questionObj.respuestas.sort(() => Math.random() - 0.5);

    switch(propiedadPregunta) {
        case "capitalLabel":
            questionObj.pregunta = `¿Cuál es la capital de ${entidadLabel}?`;
            break;
        case "jefeLabel":
            questionObj.pregunta = `¿Quién es el jefe de estado de ${entidadLabel}?`;
            break;
        case "eventLabel":
            questionObj.pregunta = `¿En qué evento histórico participó ${entidadLabel}?`;
            break;
        case "idiomaLabel":
            questionObj.pregunta = `¿Cuál es uno de los idiomas oficiales de ${entidadLabel}?`;
            break;
        case "fronteraLabel":
            questionObj.pregunta = `¿Con qué país comparte frontera ${entidadLabel}?`;
            break;
        case "lemaLabel":
            questionObj.pregunta = `¿Cuál es el lema de ${entidadLabel}?`;
            break;
        case "edadLabel":
            questionObj.pregunta = `¿Cuál es la esperanza de vida media de ${entidadLabel}?`;
            questionObj.respuestas = questionObj.respuestas.map(x => Math.floor(x));
            questionObj.correcta = Math.floor(questionObj.correcta);
            break;
        case "fundacionLabel":
            questionObj.pregunta = `¿En qué fecha se fundó ${entidadLabel}?`;
            questionObj.respuestas = questionObj.respuestas.map(d => {
                d = new Date(d)
                return `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`;
            });
            var d = new Date(questionObj.correcta);
            questionObj.correcta = `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`;
            break;
        case "gobiernoLabel":
            questionObj.pregunta = `¿Cuál es la forma de gobierno de ${entidadLabel}?`;
            break;
        default:
            questionObj.pregunta = `¿Cuál es la propiedad ${entidadLabel} de ${entidadLabel}?`;
    }

    return questionObj;
}

// Función principal para generar preguntas aleatorias
async function generateRandomQuestions(n) {
    const data = await getData();
    if (data.length === 0) {
        console.log("No se pudo obtener datos para generar preguntas.");
        return;
    }

    const questions = [];

    // Generar 5 preguntas aleatorias
    for (let i = 0; i < n; i++) {
        const question = Promise.resolve(generateRandomQuestion(data));
        questions.push(question);
    }

    return Promise.all(questions);
}

generateRandomQuestions(25)
    .then(questions => {
        console.log(questions);
    })
    .catch(error => console.error("Error generando preguntas:", error));
