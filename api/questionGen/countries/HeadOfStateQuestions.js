const { fetch } = require('cross-fetch');

async function consultaSPARQL() {
  const endpointUrl = 'https://query.wikidata.org/sparql';

  const query = `
    SELECT DISTINCT ?countryLabel ?headLabel WHERE {
      ?country wdt:P31 wd:Q6256; # Selecciona entidades que son países
               wdt:P35 ?head.  # Obtiene la forma de gobierno de cada país
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
    head: binding.headLabel.value
  }));
}

async function obtenerPregunta() {
  const sparqlResult = await consultaSPARQL();
  const randomIndex = Math.floor(Math.random() * sparqlResult.length);
  const selectedCountry = sparqlResult[randomIndex];

  const pregunta = `¿Quién es el jefe de estado de ${selectedCountry.country}?`;
  const respuestas = sparqlResult.map(result => result.head);
  const respuestaCorrecta = selectedCountry.head;

  const formato = {
    pregunta: pregunta,
    respuestas: respuestas,
    respuestaCorrecta: respuestaCorrecta
  };

  return formato;
}

obtenerPregunta().then(pregunta => console.log(pregunta));
