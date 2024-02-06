const { fetch } = require('cross-fetch');

async function consultaSPARQL() {
  const endpointUrl = 'https://query.wikidata.org/sparql';

  const query = `
    SELECT DISTINCT ?countryLabel ?capitalLabel WHERE {
      ?country wdt:P31 wd:Q6256; # Selecciona entidades que son países
               wdt:P36 ?capital.  # Obtiene la capital de cada país
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
    capital: binding.capitalLabel.value
  }));
}

async function obtenerPregunta() {
  const sparqlResult = await consultaSPARQL();
  const randomIndex = Math.floor(Math.random() * sparqlResult.length);
  const selectedCountry = sparqlResult[randomIndex];

  const pregunta = `¿Cuál es el idioma oficial de ${selectedCountry.country}?`;
  const respuestas = sparqlResult.map(result => result.capital);
  const respuestaCorrecta = selectedCountry.capital;

  const formato = {
    pregunta: pregunta,
    respuestas: respuestas,
    respuestaCorrecta: respuestaCorrecta
  };

  return formato;
}

obtenerPregunta().then(pregunta => console.log(pregunta));
