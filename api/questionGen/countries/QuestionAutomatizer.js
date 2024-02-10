const { fetch } = require('cross-fetch');
const { format } = require('date-fns');
const { es } = require('date-fns/locale');

// q es la entidad, p la propiedad
async function consultaSPARQL(questionType, formatter = x => x) {
    if(questionType.formatter){
        formatter = questionType.formatter
    }

    const regex = /^Q\d+$/;


    const queryTrue = `
        SELECT ?entityLabel ?property ?propertyLabel
        WHERE {
            ?entity wdt:P31 wd:${questionType.entity};
                wdt:${questionType.property} ?property .
            SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es". }
        }
        ORDER BY UUID()
        LIMIT 1
    `;

    var resultTrue = await executeQuery(queryTrue)

    const entityLabel = resultTrue.results.bindings[0].entityLabel.value;
    const propertyLabel = resultTrue.results.bindings[0].propertyLabel.value;
    const url = resultTrue.results.bindings[0].property.type == 'url'? resultTrue.results.bindings[0].property.value : '';
    const id = url.substring(url.lastIndexOf("/") + 1);

    const queryFalse = `
        SELECT DISTINCT ?propertyLabel
        WHERE {
        ?entity wdt:P31 wd:${questionType.entity};  # Selecciona entidades que son países (o cualquier entidad)
            wdt:${questionType.property} ?property .
            MINUS { ?property wdt:${questionType.property} wd:${id}. }  # Excluye entidades donde la propiedad dada es igual al valor dado
        SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es". }
        }   
        ORDER BY UUID()
        LIMIT 3
    `; 

    var resultFalse = await executeQuery(queryFalse)

    return {
        pregunta: `${questionType.question} ${entityLabel}?`,
        respuestas: [propertyLabel, ...resultFalse.results.bindings.map(b => b.propertyLabel.value)].map(x => formatter(x)),
        respuestaCorrecta: formatter(propertyLabel)
    };
}

async function executeQuery(query){
    const endpointUrl = 'https://query.wikidata.org/sparql';

    const encodedQuery = encodeURIComponent(query);
    const sparqlUrl = `${endpointUrl}?query=${encodedQuery}&format=json`;

    const response = await fetch(sparqlUrl);
    const data = await response.json();

    return data;
}

var questionTypes = [
    {
        "question": "¿Cuál es la capital de",
        "entity": "Q6256",       
        "property": "P36"
    },
    {   
        "question": "¿Quién es el jefe de estado de",
        "entity": "Q6256",       
        "property": "P35"
    }, 
    {   //A veces se muestra el nombre de la entidad (Q...) en vez del nombre del evento
        "question": "¿En qué evento histórico participó",
        "entity": "Q6256",       
        "property": "P1344"
    },
    {   
        "question": "¿Cuál es uno de los idiomas oficiales de",
        "entity": "Q6256",       
        "property": "P37"
    },
    {   
        "question": "¿Con qué país comparte frontera",
        "entity": "Q6256",       
        "property": "P47"
    },
    {   
        "question": "¿Cuál es la moneda de",
        "entity": "Q6256",       
        "property": "P38"
    }
]

//var randomType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
var randomType = questionTypes[2];

consultaSPARQL(randomType).then(pregunta => console.log(pregunta));
