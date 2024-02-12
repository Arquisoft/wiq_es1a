const GenericGenerator = require('./GenericGenerator')

var tematicas = {
    "paises": {
        entity: "Q6256",
        props: ["P36", "P35", "P1344", "P37", "P47", "P2250", "P571", "P122", "P1451"],
        preguntas: [
            "¿Cuál es la capital de ", 
            "¿Quién es el jefe de estado de ",
            "¿En qué evento histórico participó ",
            "¿Cuál es uno de los idiomas oficiales de ",
            "¿Con qué país comparte frontera ",
            "¿Cuál es la esperanza de vida media de ",
            "¿En qué fecha se fundó ",
            "¿Cuál es la forma de gobierno de ",
            "¿Cuál es el lema de "
        ]
    }
}

class GeneratorChooser{
    constructor(){
        var paises = tematicas["paises"];
        this.paises = new GenericGenerator(paises.entity, paises.props, paises.preguntas);
    }

    getCountryQuestions(n){
        return this.paises.generateRandomQuestions(n).then(x => x);
    }
}

module.exports = GeneratorChooser;