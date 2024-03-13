const Stats = require('./stats-model.js');

class StatsForUser {

    async getStatsForUser(username,gamemode){
        var statsJSON=null;
            if(gamemode=="clasico" || gamemode=="bateria"){
                statsJSON = await this.getStats(username,gamemode);
            }
        return statsJSON;
            
    }

    async getStats(username,gamemode){
        try {
            var stats = await Stats.findOne({ username:username,gamemode:gamemode });
    
            if (stats) {
                console.log("estas son las stats");
                console.log(stats);
                return {
                    username: stats.username,
                    gamemode: stats.gamemode,
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

    calculateStats(username,gamemode,gameData){
        console.log("este es el game data");
        console.log(gameData);
        const totalGamesPlayed = gameData.nGamesPlayed + 1;
        const newAvgPoints = (gameData.avgPoints * gameData.nGamesPlayed + gameData.points) / totalGamesPlayed;
        const newTotalPoints = gameData.totalPoints + gameData.points;
        const newTotalCorrectQuestions = gameData.totalCorrectQuestions + gameData.correctAnswers;
        const newTotalIncorrectQuestions = gameData.totalIncorrectQuestions + gameData.incorrectAnswers;
        const newRatioCorrect = (newTotalCorrectQuestions / (newTotalIncorrectQuestions+newTotalCorrectQuestions))*100;
        const newAvgTime = (gameData.avgTime * gameData.nGamesPlayed + gameData.avgTime) / totalGamesPlayed;

        console.log(totalGamesPlayed);
        console.log(newAvgPoints);
        console.log(newTotalPoints);
        console.log(newTotalCorrectQuestions);
        console.log(newTotalIncorrectQuestions);
        console.log(newRatioCorrect);
        console.log(newAvgTime);

        return {
            username:username,
            gamemode: gamemode,
            nGamesPlayed: totalGamesPlayed,
            avgPoints: newAvgPoints,
            totalPoints: newTotalPoints,
            totalCorrectQuestions: newTotalCorrectQuestions,
            totalIncorrectQuestions: newTotalIncorrectQuestions,
            ratioCorrect: newRatioCorrect,
            avgTime: newAvgTime
        };
    }

    async getRanking(gamemode) {
        try {
            var stats = await Stats.find({gamemode:gamemode}).sort({ avgPoints: -1 }).limit(10);
    
            if (stats && stats.length > 0) {
                return stats.map(stat => ({
                    username: stat.username,
                    avgPoints: stat.avgPoints
                }));
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error al obtener estadísticas:', error);
            throw error;
        }
    }
    
}

module.exports = StatsForUser;

