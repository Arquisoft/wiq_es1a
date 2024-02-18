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
        return this.generators.get(tematica).generateRandomQuestions(n);
    }

    async loadGenerators(){     
        for(let i = 0 ; i < this.tematicas.length ; i++){
            var gen = this.generators.get(this.tematicas[i]);
            await gen.getData();
        }
    }
}

module.exports = GeneratorChooser;