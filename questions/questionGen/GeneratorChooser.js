const GenericGenerator = require('./GenericGenerator')
const fs = require('fs');

class GeneratorChooser{
    constructor(){
        this.generators = new Map();
        this.tematicas = [];
        this.leer_json(`C:\\Users\\marti\\Desktop\\ASW\\wiq_es1a\\questions\\data\\tematicas.json`);
    }

    leer_json(ruta){
        const datos = fs.readFileSync(ruta);
        var tematicas = JSON.parse(datos);

        for(let i in tematicas){
            var tematica = tematicas[i];
            this.tematicas.push(i);
            this.generators.set(i, 
                new GenericGenerator(tematica.entity, tematica.props, tematica.preguntas)
            );
        }
    }

    getQuestions(tematica, n){
        if(tematica === "all"){
            var questions = [];
            for(let i = 0 ; i < n ; i++){
                let rand = Math.floor(Math.random() * this.tematicas.length)
                let randTematica =this.tematicas[rand];
                let q = this.generators.get(randTematica).generateRandomQuestions(1);
                questions.push(q);
            }
            return questions.flat();
        }else{
            return this.generators.get(tematica).generateRandomQuestions(n);
        }
    }

    async loadGenerators(){     
        for(let i = 0 ; i < this.tematicas.length ; i++){
            var gen = this.generators.get(this.tematicas[i]);
            console.log("Cargando temática: " + this.tematicas[i]);
            await gen.getData();
            await this.#sleep(10000);
        }
    }

    #sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
// var gen = new GeneratorChooser();
// gen.loadGenerators()
//       .then(() => {
//         console.log("Generators loaded successfully!");
//       })
//       .catch((error) => {
//         console.error("Error al cargar los generadores de preguntas:", error);
//       });

module.exports = GeneratorChooser;