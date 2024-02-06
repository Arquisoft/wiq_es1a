const { fetch } = require('cross-fetch');
const { format } = require('date-fns');
const { es } = require('date-fns/locale');

//TODO: Hay algunos eventos que salen como entidad (ej. Q3293979) en vez de su nombre). Hay que solucionarlo 
async function consultaSPARQL() {
  const endpointUrl = 'https://query.wikidata.org/sparql';

  const query = `
    SELECT DISTINCT ?countryLabel ?eventLabel WHERE {
      ?country wdt:P31 wd:Q6256; # Selecciona entidades que son países
               wdt:P1344 ?event.  # Obtiene la fecha de un evento histórico en el que participó de cada país
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
    country: binding.countryLabel.value,
    event: binding.eventLabel.value
  }));
}

async function obtenerPregunta() {
  const sparqlResult = await consultaSPARQL();
  const randomIndex = Math.floor(Math.random() * sparqlResult.length);
  const selectedCountry = sparqlResult[randomIndex];

  const pregunta = `¿En qué evento histórico participó ${selectedCountry.country}?`;
  const respuestas = sparqlResult.map(result => result.event);
  const respuestaCorrecta = selectedCountry.event;

  const formato = {
    pregunta: pregunta,
    respuestas: respuestas,
    respuestaCorrecta: respuestaCorrecta
  };

  return formato;
}

obtenerPregunta().then(pregunta => console.log(pregunta));
