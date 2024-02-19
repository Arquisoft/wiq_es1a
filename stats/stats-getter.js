import partidas from './partidas.js';

class StatsForUser {

    nGamesPlayed = 0;
    avgPoints = 0;
    maxPoints = 0;
    minPoints = 10000;
    totalPoints = 0;
    nQuestionsAnswered = 0;
    questionsPerGame = 0;
    

    constructor(username){
        this.username = username;
        //si existe el usuario (IMPLEMENTAR COMPROBACION)
        this.getStatsForUser();
    }

    getStatsForUser(){
        for (const partida of partidas){
            if (partida.username === this.username){
                this.nGamesPlayed++;
                this.totalPoints += partida.points;
                this.nQuestionsAnswered += partida.nQuestions;
                if (partida.points > this.maxPoints){
                    this.maxPoints = partida.points;
                }
                if (partida.points < this.minPoints){
                    this.minPoints = partida.points;
                }
            }
        }

        this.avgPoints = this.totalPoints / this.nGamesPlayed;
        this.questionsPerGame = this.nQuestionsAnswered / this.nGamesPlayed;
    }
}

export default StatsForUser;