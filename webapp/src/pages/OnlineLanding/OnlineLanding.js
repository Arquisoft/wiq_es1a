import React, { useState, useEffect, useMemo } from "react";
import Nav from "../../components/Nav/Nav";
import Footer from "../../components/Footer/Footer";
import { socket } from "./socket";

function OnlineLanding() {
  const playerId = useMemo(() => localStorage.getItem("token"));
  const playerName = useMemo(() => localStorage.getItem("username"));
  const [roomId, setRoomId] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [inRoom, setInRoom] = useState(false);
  const [players, setPlayers] = useState([]);
  const [question, setQuestion] = useState(null);

  useEffect(() => {
    function onPlayers(players) {
      console.log(players);
      setPlayers(players);
    }

    function onQuestion(question) {
      setQuestion(question);
    }

    socket.on('players', onPlayers);

    socket.on('question', onQuestion);
  }, []);

  useEffect(() => {
    if (isReady) {
      socket.emit('ready', roomId, playerId);
    } else {
      socket.emit('notready', roomId, playerId);
    }
  }, [isReady]);

  const handleRoomSubmit = (e) => {
    e.preventDefault();
    if (roomId) {
      socket.emit('joinRoom', roomId, playerId, playerName);
      setInRoom(true);
    }
  };

  const estiloRespuesta = () => {
    if (isReady) {
      return { backgroundColor: "#0F0F0F", color: "#F0F0F0" };
    }
    return {};
  };

  const handleRespuestaSeleccionada = (respuesta) => {
    socket.emit('submit', roomId, playerId, respuesta);
  };

  if (question) {
    return (
      <div className="questionContainer">
        <h2>Pregunta:</h2>
        <p>{question.pregunta}</p>
        <div className="responsesContainer">
          {question.respuestas.map((respuesta, index) => (
            <button
              key={index}
              onClick={() => handleRespuestaSeleccionada(respuesta)}
            >
              {respuesta}
            </button>
          ))}
        </div>
        {/* <div className="timer">Tiempo restante: {tiempoRestante}</div>
        <div className="points">Puntuación: {puntuacion}</div> */}
      </div>
    );
  }

  return (
    <>
      <Nav />
      {!inRoom ? (
        <form onSubmit={handleRoomSubmit}>
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Enter room ID"
          />
          <button type="submit">Unirse a la sala</button>
        </form>
      ) : (
        <div>
          <h2>Estás en el lobby de la partida {roomId}</h2>
          <p>Jugadores:</p>
          <ul>
            {players &&
              players.map((player) => <li>{player.name}</li>)}
          </ul>
          <button
            type="button"
            onClick={() => {
              setIsReady(!isReady);
            }}
            style={estiloRespuesta()}
          >
            Listo
          </button>
          {isReady ? (
            <p>Estás listo. Esperando por los demás jugadores</p>
          ) : (
            <p>Presiona el botón cuando estés listo</p>
          )}
        </div>
      )}
      <Footer />
    </>
  );
}

export default OnlineLanding;
