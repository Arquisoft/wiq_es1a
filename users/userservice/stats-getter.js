const User = require('./user-model.js');


class StatsForUser {

    async getStatsForUser(username){
        try {
            const user = await User.findOne({ username: username });
            
            if (!user) {
                throw new Error('Usuario no encontrado');
            }

            const partidas = user.games;

            var nGamesPlayed = partidas.length;
            var totalPoints = 0;
            var totalCorrectQuestions = 0;
            var totalIncorrectQuestions = 0;
            var totalTime=0;

            for (const partida of partidas){
                totalPoints += partida.points;
                totalCorrectQuestions += partida.correctAnswers;
                totalIncorrectQuestions += partida.incorrectAnswers;
                totalTime+=partida.avgTime;
            }

            var avgPoints = nGamesPlayed > 0 ?
             totalPoints / nGamesPlayed : 0;

            var ratioCorrectToIncorrect = totalIncorrectQuestions !== 0 ?
             totalCorrectQuestions / totalIncorrectQuestions : totalCorrectQuestions;

            var avgTime = nGamesPlayed > 0 ? totalTime / nGamesPlayed : 0;

            var statsJSON = {
                username: username,
                nGamesPlayed: nGamesPlayed,
                avgPoints: avgPoints,
                totalPoints: totalPoints,
                totalCorrectQuestions: totalCorrectQuestions,
                totalIncorrectQuestions: totalIncorrectQuestions,
                ratioCorrectToIncorrect: ratioCorrectToIncorrect,
                avgTime: avgTime
            };

            return statsJSON;
        } catch (error) {
            console.error('Error al obtener las estadísticas del usuario:', error);
            throw error;
        }
    }
}

module.exports = StatsForUser;

