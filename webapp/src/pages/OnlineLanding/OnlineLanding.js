import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

const Game = () => {
    const [roomId, setRoomId] = useState('');
    const [players, setPlayers] = useState([]);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [questions, setQuestions] = useState([
        {
            question: '¿Cuál es la capital de Francia?',
            options: ['Londres', 'París', 'Madrid', 'Berlín'],
            correctAnswer: 1
        },
        {
            question: '¿Cuál es el río más largo del mundo?',
            options: ['Amazonas', 'Nilo', 'Mississippi', 'Yangtsé'],
            correctAnswer: 0
        }
    ]);
    const [selectedOption, setSelectedOption] = useState(null);

    useEffect(() => {
        // Manejar la actualización de jugadores
        socket.on('updatePlayers', (updatedPlayers) => {
            setPlayers(updatedPlayers);
        });

        // Manejar la siguiente pregunta
        socket.on('nextQuestion', () => {
            setQuestionIndex(prevIndex => prevIndex + 1);
            setSelectedOption(null);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const handleJoinRoom = () => {
        socket.emit('joinRoom', roomId);
    };

    const handleAnswer = (optionIndex) => {
        setSelectedOption(optionIndex);
        socket.emit('answer', { roomId, playerId: socket.id, optionIndex });
    };

    return (
        <div>
            <h2>Game</h2>
            {!roomId ? (
                <div>
                    <input type="text" placeholder="ID de Sala" value={roomId} onChange={(e) => setRoomId(e.target.value)} />
                    <button onClick={handleJoinRoom}>Unirse a la Sala</button>
                </div>
            ) : (
                <div>
                    <h3>Players:</h3>
                    <ul>
                        {players.map((player, index) => (
                            <li key={index}>{player}</li>
                        ))}
                    </ul>
                    {questions.length > 0 && questionIndex < questions.length && (
                        <div>
                            <h3>{questions[questionIndex].question}</h3>
                            <ul>
                                {questions[questionIndex].options.map((option, index) => (
                                    <li key={index} onClick={() => handleAnswer(index)}>{option}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {selectedOption !== null && <p>Waiting for next question...</p>}
                </div>
            )}
        </div>
    );
};

export default Game;
