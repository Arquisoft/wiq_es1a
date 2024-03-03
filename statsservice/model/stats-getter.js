const User = require('../../users/userservice/user-model.js');


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
            var avgTime=0;

            for (const partida of partidas){
                totalPoints += partida.points;
                totalCorrectQuestions += partida.correctAnswers;
                totalIncorrectQuestions += partida.incorrectAnswers;
            }

            const avgPoints = nGamesPlayed > 0 ?
             totalPoints / nGamesPlayed : 0;

            const ratioCorrectToIncorrect = totalIncorrectQuestions !== 0 ?
             totalCorrectQuestions / totalIncorrectQuestions : totalCorrectQuestions;

            const statsJSON = {
                username: username,
                nGamesPlayed: nGamesPlayed,
                avgPoints: avgPoints,
                totalPoints: totalPoints,
                totalCorrectQuestions: totalCorrectQuestions,
                totalIncorrectQuestions: totalIncorrectQuestions,
                ratioCorrectToIncorrect: ratioCorrectToIncorrect
            };

            return statsJSON;
        } catch (error) {
            console.error('Error al obtener las estadísticas del usuario:', error);
            throw error;
        }
    }
}

module.exports = StatsForUser;

