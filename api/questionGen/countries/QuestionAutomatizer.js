const { fetch } = require('cross-fetch');

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

async function obtenerPregunta(entity, property, question, formatter = x => x) {
    const sparqlResult = await consultaSPARQL(entity, property);
    const randomIndex = Math.floor(Math.random() * sparqlResult.length);
    const selectedEntity = sparqlResult[randomIndex];

    const pregunta = `${question} ${selectedEntity.entity}?`;
    const respuestas = sparqlResult.map(result => result.property).map(x => formatter(x));
    const respuestaCorrecta = formatter(selectedEntity.property);

    const formato = {
        pregunta: pregunta,
        respuestas: respuestas,
        respuestaCorrecta: respuestaCorrecta
    };

    return formato;
}

obtenerPregunta("Q6256", "P36", "¿Cuál es la capital de ").then(pregunta => console.log(pregunta));
