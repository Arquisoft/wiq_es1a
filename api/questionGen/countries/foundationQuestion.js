const { fetch } = require('cross-fetch');
const { format } = require('date-fns');
const { es } = require('date-fns/locale');

async function consultaSPARQL() {
  const endpointUrl = 'https://query.wikidata.org/sparql';

  const query = `
    SELECT DISTINCT ?countryLabel ?foundationLabel WHERE {
      ?country wdt:P31 wd:Q6256; # Selecciona entidades que son países
               wdt:P571 ?foundation.  # Obtiene la fecha de fundación de cada país
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es". }
    }
    LIMIT 4
  `;

  const encodedQuery = encodeURIComponent(query);
  const sparqlUrl = `${endpointUrl}?query=${encodedQuery}&format=json`;

  const response = await fetch(sparqlUrl);
  const data = await response.json();

  return data.results.bindings.map(binding => ({
    country: binding.countryLabel.value,
    foundation: binding.foundationLabel.value
  }));
}

async function obtenerPregunta() {
  const sparqlResult = await consultaSPARQL();
  const randomIndex = Math.floor(Math.random() * sparqlResult.length);
  const selectedCountry = sparqlResult[randomIndex];

  const pregunta = `¿Cuál fue la fecha de fundación de ${selectedCountry.country}?`;
  const respuestas = sparqlResult.map(result => result.foundation).map(f => format(new Date(f), "dd 'de' MMMM 'de' yyyy", { locale: es }));
  const respuestaCorrecta = format(new Date(selectedCountry.foundation), "dd 'de' MMMM 'de' yyyy", { locale: es });

  const formato = {
    pregunta: pregunta,
    respuestas: respuestas,
    respuestaCorrecta: respuestaCorrecta
  };

  return formato;
}

obtenerPregunta().then(pregunta => console.log(pregunta));
