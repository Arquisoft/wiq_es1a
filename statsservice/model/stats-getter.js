const StatsClasico = require('./stats-clasico-model.js');

class StatsForUser {

    async getStatsForUser(username,gamemode){
        var statsJSON=null;
            if(gamemode==="clasico"){
                statsJSON = await this.getStatsClasico(username);
            }
        return statsJSON;
            
    }

    async getStatsClasico(username){
        try {
            var stats = await StatsClasico.findOne({ username });
    
            if (stats) {
                return {
                    username: stats.username,
                    nGamesPlayed: stats.nGamesPlayed,
                    avgPoints: stats.avgPoints,
                    totalPoints: stats.totalPoints,
                    totalCorrectQuestions: stats.totalCorrectQuestions,
                    totalIncorrectQuestions: stats.totalIncorrectQuestions,
                    ratioCorrectToIncorrect: stats.ratioCorrectToIncorrect,
                    avgTime: stats.avgTime
                };
            } else {
                return null; // Si no se encuentran estadísticas para el usuario
            }
        } catch (error) {
            console.error('Error al obtener estadísticas:', error);
            throw error;
        }
    }

    calculateStatsClasico(gameData){
        const totalGamesPlayed = gameData.nGamesPlayed + 1;
        const newAvgPoints = (gameData.avgPoints * gameData.nGamesPlayed + gameData.points) / totalGamesPlayed;
        const newTotalPoints = gameData.totalPoints + gameData.points;
        const newTotalCorrectQuestions = gameData.totalCorrectQuestions + gameData.correctAnswers;
        const newTotalIncorrectQuestions = gameData.totalIncorrectQuestions + gameData.incorrectAnswers;
        const newRatioCorrectToIncorrect = newTotalCorrectQuestions / newTotalIncorrectQuestions;
        const newAvgTime = (gameData.avgTime * gameData.nGamesPlayed + gameData.avgTime) / totalGamesPlayed;

        return {
            nGamesPlayed: totalGamesPlayed,
            avgPoints: newAvgPoints,
            totalPoints: newTotalPoints,
            totalCorrectQuestions: newTotalCorrectQuestions,
            totalIncorrectQuestions: newTotalIncorrectQuestions,
            ratioCorrectToIncorrect: newRatioCorrectToIncorrect,
            avgTime: newAvgTime
        };
    }
}

module.exports = StatsForUser;

