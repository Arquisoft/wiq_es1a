const { fetch } = require('cross-fetch');
const { format } = require('date-fns');
const { es } = require('date-fns/locale');

// q es la entidad, p la propiedad
async function consultaSPARQL(entity, property) {
    const endpointUrl = 'https://query.wikidata.org/sparql';

    const query = `
        SELECT DISTINCT ?entityLabel ?propertyLabel WHERE {
        ?entity wdt:P31 wd:${entity}; # Selecciona entidades que son países
                wdt:${property} ?property.  # Obtiene la propiedad deseada
        SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es". }
        }
        ORDER BY UUID()
        LIMIT 4
    `;

    const encodedQuery = encodeURIComponent(query);
    const sparqlUrl = `${endpointUrl}?query=${encodedQuery}&format=json`;

    const response = await fetch(sparqlUrl);
    const data = await response.json();

    return data.results.bindings.map(binding => ({
        entity: binding.entityLabel.value,
        property: binding.propertyLabel.value
    }));
}

async function obtenerPregunta(questionType, formatter = x => x) {
    if(questionType.formatter){
        formatter = questionType.formatter
    }
    const sparqlResult = await consultaSPARQL(questionType.entity, questionType.property);
    const randomIndex = Math.floor(Math.random() * sparqlResult.length);
    const selectedEntity = sparqlResult[randomIndex];

    const pregunta = `${questionType.question} ${selectedEntity.entity}?`;
    const respuestas = sparqlResult.map(result => result.property).map(x => formatter(x));
    const respuestaCorrecta = formatter(selectedEntity.property);

    const formato = {
        pregunta: pregunta,
        respuestas: respuestas,
        respuestaCorrecta: respuestaCorrecta
    };

    return formato;
}

var questionTypes = [
    {
        "question": "¿Cuál es la capital de",
        "entity": "Q6256",       
        "property": "P36"
    },
    {
        "question": "¿Cuál fue la fecha de fundación de",
        "entity": "Q6256",
        "property": "P571",
        "formatter": f => format(new Date(f), "dd 'de' MMMM 'de' yyyy", { locale: es })
    },
    {   //A veces se repiten los nombres
        "question": "¿Quién es el jefe de estado de",
        "entity": "Q6256",       
        "property": "P35"
    }, 
    {   //A veces se muestra el nombre de la entidad (Q...) en vez del nombre del evento
        "question": "¿En qué evento histórico participó",
        "entity": "Q6256",       
        "property": "P1344"
    },
    {   //Más de una puede ser correcta
        "question": "¿Cuál es uno de los idiomas oficiales de",
        "entity": "Q6256",       
        "property": "P37"
    },
    {
        "question": "¿Cuál es la esperanza de vida media de",
        "entity": "Q6256",       
        "property": "P2250",
        "formatter": x => Math.floor(x)
    }
]

var randomType = questionTypes[Math.floor(Math.random() * questionTypes.length)];

obtenerPregunta(randomType).then(pregunta => console.log(pregunta));
