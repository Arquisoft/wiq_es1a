const { fetch } = require('cross-fetch');
const { format } = require('date-fns');
const { es } = require('date-fns/locale');

Array.prototype.groupByCountry = function() {
    return this.reduce(function(acc, obj) {
        const country = obj.countryLabel.value;
        const existingCountryIndex = acc.findIndex(item => item.country === country);
        if (existingCountryIndex === -1) {
            acc.push({ country, items: [obj] });
        } else {
            acc[existingCountryIndex].items.push(obj);
        }
        return acc;
    }, []);
};


// Función para realizar la consulta SPARQL y obtener los datos
async function getData() {
    const sparqlQuery = `
    SELECT DISTINCT ?countryLabel ?capitalLabel ?jefeLabel ?eventLabel ?idiomaLabel ?fronteraLabel ?lemaLabel
    WHERE {
        ?country wdt:P31 wd:Q6256;            
             wdt:P36 ?capital;   
             wdt:P35 ?jefe;
             wdt:P1344 ?event;
             wdt:P37 ?idioma;
             wdt:P47 ?frontera;
             wdt:P1451 ?lema .
        SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es" }
    }`;

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

// Función para generar una pregunta aleatoria
function generateRandomQuestion(data) {
    const randomIndex = Math.floor(Math.random() * data.keys().length);
    const props = ["capitalLabel", "jefeLabel", "eventLabel", "idiomaLabel", "fronteraLabel", "lemaLabel"];
    const randomPropIndex = Math.floor(Math.random() * props.length);
    const randomProp = props[randomPropIndex];

    const entity = data[randomIndex];
    const prop = data[randomIndex][randomProp].value;

    const questionObj = {
        pregunta: "",
        respuestas: [],
        correcta: ""
    };

    questionObj.respuestas.push(prop)

    // Obtener tres respuestas incorrectas distintas
    while (questionObj.respuestas.length < 4) {
        let randomEntityIndex = Math.floor(Math.random() * data.length);
        const randomProperty = data[randomEntityIndex][props[randomPropIndex]].value;
        if (!questionObj.respuestas.includes(randomProperty) && randomProperty !== prop) {
            questionObj.respuestas.push(randomProperty);
        }
    }

    // Dependiendo de la propiedad seleccionada, configurar la pregunta y la respuesta correcta
    switch(randomProp) {
        case "capitalLabel":
            questionObj.pregunta = `¿Cuál es la capital de ${entity}?`;
            questionObj.correcta = prop;
            break;
        case "jefeLabel":
            questionObj.pregunta = `¿Quién es el jefe de estado de ${entity}?`;
            questionObj.correcta = prop;
            break;
        case "eventLabel":
            questionObj.pregunta = `¿Cuál es el evento importante de ${entity}?`;
            questionObj.correcta = prop;
            break;
        case "idiomaLabel":
            questionObj.pregunta = `¿Cuál es el idioma principal de ${entity}?`;
            questionObj.correcta = prop;
            break;
        case "fronteraLabel":
            questionObj.pregunta = `¿Cuál es la frontera de ${entity}?`;
            questionObj.correcta = prop;
            break;
        case "lemaLabel":
            questionObj.pregunta = `¿Cuál es el lema de ${entity}?`;
            questionObj.correcta = prop;
            break;
        default:
            questionObj.pregunta = `¿Cuál es la propiedad ${randomProp} de ${entity}?`;
            questionObj.correcta = prop;
    }

    // Mezclar las respuestas
    shuffleArray(questionObj.respuestas);

    return questionObj;
}

// Función principal para generar preguntas aleatorias
async function generateRandomQuestions() {
    const data = await getData();
    if (data.length === 0) {
        console.log("No se pudo obtener datos para generar preguntas.");
        return;
    }

    const questions = [];

    // Generar 5 preguntas aleatorias
    for (let i = 0; i < 5; i++) {
        const question = generateRandomQuestion(data);
        questions.push(question);
    }

    return questions;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Llamar a la función principal y mostrar el resultado
generateRandomQuestions()
    .then(questions => console.log(questions))
    .catch(error => console.error("Error generando preguntas:", error));
