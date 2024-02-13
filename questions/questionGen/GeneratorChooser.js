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
    },
    "famosos":{
        entity: "Q31629",
        props: ["P495", "P1873", "P575", "P61"],
        preguntas: [
            "¿En qué país se originó el ", 
            "¿Cuál es el número máximo de jugadores en el ",
            "¿Cuándo se inventó el ",
            "¿Quién inventó el ",
        ]
    }
}

class GeneratorChooser{
    constructor(){
        var paises = tematicas["paises"];
        this.paises = new GenericGenerator(paises.entity, paises.props, paises.preguntas);

        var famosos = tematicas["famosos"];
        this.famosos = new GenericGenerator(famosos.entity, famosos.props, famosos.preguntas);
    }

    getCountryQuestions(n){
        return this.paises.generateRandomQuestions(n).then(x => x);
    }

    getFamososQuestions(n){
        return this.famosos.generateRandomQuestions(n).then(x => x);
    }
}

var x = new GeneratorChooser();
//x.getCountryQuestions(5).then(x => console.log(x))
x.getFamososQuestions(5).then(x => console.log(x))

//module.exports = GeneratorChooser;