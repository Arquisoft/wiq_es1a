const { fetch } = require('cross-fetch');

async function consultarIdiomaOficialAleatorio() {
  const endpointUrl = 'https://query.wikidata.org/sparql';

  const query = `
    SELECT DISTINCT ?countryLabel ?idiomaLabel WHERE {
      ?country wdt:P31 wd:Q6256; # Selecciona entidades que son países
               wdt:P37 ?idioma.  # Obtiene el idioma oficial de cada país
      ?idioma wdt:P31 wd:Q34770. # Selecciona entidades que son idiomas
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es". }
    }
    ORDER BY UUID()
    LIMIT 1
  `;

  const encodedQuery = encodeURIComponent(query);
  const sparqlUrl = `${endpointUrl}?query=${encodedQuery}&format=json`;

  const response = await fetch(sparqlUrl);
  const data = await response.json();

  if (data.results.bindings.length === 0) {
    return "No se pudo encontrar información sobre el idioma oficial de un país en Wikidata.";
  }

  const country = data.results.bindings[0].countryLabel.value;
  const idiomaOficial = data.results.bindings[0].idiomaLabel.value;

  // Generar otras tres opciones de idioma
  const opcionesIdioma = await generarOpcionesIdioma(idiomaOficial);

  const formato = {
    pregunta: `¿Cuál es el idioma oficial de ${country}?`,
    respuestas: opcionesIdioma,
    respuestaCorrecta: idiomaOficial
  };

  return formato;
}

async function generarOpcionesIdioma(respuestaCorrecta) {
  const endpointUrl = 'https://query.wikidata.org/sparql';

  const query = `
    SELECT DISTINCT ?idiomaLabel WHERE {
      ?idioma wdt:P31 wd:Q34770. # Selecciona entidades que son idiomas
      FILTER(?idioma != wd:${respuestaCorrecta.replace(/\s/g, '_')})
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es". }
    }
    ORDER BY UUID()
    LIMIT 3
  `;

  const encodedQuery = encodeURIComponent(query);
  const sparqlUrl = `${endpointUrl}?query=${encodedQuery}&format=json`;

  const response = await fetch(sparqlUrl);
  const data = await response.json();

  const opciones = data.results.bindings.map(binding => binding.idiomaLabel.value);
  opciones.push(respuestaCorrecta); // Agregar la respuesta correcta al final

  return opciones;
}

consultarIdiomaOficialAleatorio()
  .then(formato => console.log(formato))
  .catch(error => console.error("Error:", error));
