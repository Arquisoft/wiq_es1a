const Stats = require('./stats-model.js');

class StatsForUser {

    async getStatsForUser(username,gamemode){
        var statsJSON=null;
            if(gamemode=="clasico"){
                statsJSON = await this.getStats(username);
            }else if(gamemode=="bateria"){
                statsJSON = await this.getStats(username);
            }
        return statsJSON;
            
    }

    async getStats(username){
        try {
            var stats = await Stats.findOne({ username });
    
            if (stats) {
                return {
                    username: stats.username,
                    nGamesPlayed: stats.nGamesPlayed,
                    avgPoints: stats.avgPoints,
                    totalPoints: stats.totalPoints,
                    totalCorrectQuestions: stats.totalCorrectQuestions,
                    totalIncorrectQuestions: stats.totalIncorrectQuestions,
                    ratioCorrect: stats.ratioCorrect,
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

    calculateStats(gameData){
        const totalGamesPlayed = gameData.nGamesPlayed + 1;
        const newAvgPoints = (gameData.avgPoints * gameData.nGamesPlayed + gameData.points) / totalGamesPlayed;
        const newTotalPoints = gameData.totalPoints + gameData.points;
        const newTotalCorrectQuestions = gameData.totalCorrectQuestions + gameData.correctAnswers;
        const newTotalIncorrectQuestions = gameData.totalIncorrectQuestions + gameData.incorrectAnswers;
        const newRatioCorrect = (newTotalCorrectQuestions / (newTotalIncorrectQuestions+newTotalCorrectQuestions))*100;
        const newAvgTime = (gameData.avgTime * gameData.nGamesPlayed + gameData.avgTime) / totalGamesPlayed;

        return {
            nGamesPlayed: totalGamesPlayed,
            avgPoints: newAvgPoints,
            totalPoints: newTotalPoints,
            totalCorrectQuestions: newTotalCorrectQuestions,
            totalIncorrectQuestions: newTotalIncorrectQuestions,
            ratioCorrect: newRatioCorrect,
            avgTime: newAvgTime
        };
    }
}

module.exports = StatsForUser;

