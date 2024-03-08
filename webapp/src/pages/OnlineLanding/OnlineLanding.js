import React, { useState, useEffect, useMemo } from "react";
import io from "socket.io-client";
import Nav from "../../components/Nav/Nav";
import Footer from "../../components/Footer/Footer";

const socket = io.connect("http://localhost:4000");

function OnlineLanding() {
  const playerId = useMemo(() => localStorage.getItem("token"));
  const playerName = useMemo(() => localStorage.getItem("username"));
  const [roomId, setRoomId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [players, setPlayers] = useState([]);
  const [question, setQuestion] = useState(null);

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages([...messages, message]);
    });

    socket.on("players", (players) => {
      console.log(players);
      setPlayers(players);
    });

    socket.on("question", (question) => {
      setQuestion(question);
    });
  }, []);

  useEffect(() => {
    if (isReady) {
      socket.emit("ready", roomId, playerId);
    } else {
      socket.emit("notready", roomId, playerId);
    }
  }, [roomId]);

  const handleRoomSubmit = (e) => {
    e.preventDefault();
    if (roomId) {
      socket.emit("joinRoom", roomId, playerId, playerName);
    }
  };

  const estiloRespuesta = () => {
    if (isReady) {
      return { backgroundColor: "#0F0F0F", color: "#F0F0F0" };
    }
    return {};
  };

  const handleRespuestaSeleccionada = (respuesta) => {
    socket.emit('submit', playerId, respuesta)
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
      {!roomId ? (
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
              players.map((player) => {
                <li>{player.name}</li>;
              })}
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
