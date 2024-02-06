const { fetch } = require('cross-fetch');
const { format } = require('date-fns');
const { es } = require('date-fns/locale');

async function consultaSPARQL() {
  const endpointUrl = 'https://query.wikidata.org/sparql';

  const query = `
    SELECT DISTINCT ?countryLabel ?lifeLabel WHERE {
      ?country wdt:P31 wd:Q6256; # Selecciona entidades que son países
               wdt:P2250 ?life.  # Obtiene la esperanza de vida media del país
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
    lifeExpectancy: binding.lifeLabel.value
  }));
}

async function obtenerPregunta() {
  const sparqlResult = await consultaSPARQL();
  const randomIndex = Math.floor(Math.random() * sparqlResult.length);
  const selectedCountry = sparqlResult[randomIndex];
  const pregunta = `¿Cuál es la esperanza de vida media de ${selectedCountry.country}?`;
  const respuestas = sparqlResult.map(result => result.lifeExpectancy).map(x => Math.floor(x));
  const respuestaCorrecta = Math.floor(selectedCountry.lifeExpectancy);

  const formato = {
    pregunta: pregunta,
    respuestas: respuestas,
    respuestaCorrecta: respuestaCorrecta
  };

  return formato;
}

obtenerPregunta().then(pregunta => console.log(pregunta));
