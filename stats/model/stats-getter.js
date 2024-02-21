const fs = require('fs');

class StatsForUser {

    getStatsForUser(username){
        // Leer el archivo JSON de partidas
        const data = fs.readFileSync("./model/partidas.json");
        const partidas = JSON.parse(data);

        let nGamesPlayed = 0;
        let totalPoints = 0;
        let totalCorrectQuestions = 0;
        let totalIncorrectQuestions = 0;

        // Calcular las estadísticas para el usuario
        for (const partida of partidas){
            if (partida.username === this.username){
                nGamesPlayed++;
                totalPoints += partida.points;
                totalCorrectQuestions += partida.correctQuestions;
                totalIncorrectQuestions += partida.incorrectQuestions;
            }
        }

        // Calcular el promedio de puntos por juego
        const avgPoints = nGamesPlayed > 0 ? totalPoints / nGamesPlayed : 0;

        // Calcular el ratio de preguntas acertadas/falladas
        const ratioCorrectToIncorrect = totalIncorrectQuestions !== 0 ? totalCorrectQuestions / totalIncorrectQuestions : totalCorrectQuestions;

        // Construir el objeto JSON con las estadísticas
        const statsJSON = {
            username: this.username,
            nGamesPlayed: nGamesPlayed,
            avgPoints: avgPoints,
            totalPoints: totalPoints,
            totalCorrectQuestions: totalCorrectQuestions,
            totalIncorrectQuestions: totalIncorrectQuestions,
            ratioCorrectToIncorrect: ratioCorrectToIncorrect
        };

        return statsJSON;
    }

    existsUser(username){
        //TODO
        return true;
    }
}

module.exports = StatsForUser;

