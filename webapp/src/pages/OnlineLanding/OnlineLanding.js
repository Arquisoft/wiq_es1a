import React, { useState, useEffect } from "react";
import axios from "axios";
import Nav from "../../components/Nav/Nav";
import Footer from "../../components/Footer/Footer";

function OnlineLanding() {
  const [roomName, setRoomName] = useState("");
  const [roomIdInput, setRoomIdInput] = useState("");
  const [roomId, setRoomId] = useState("");
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    if (roomId) {
      // Obtener información de la sala y jugadores cuando roomId cambie
      axios
        .get(`http://localhost:5000/rooms/info/${roomId}`)
        .then((response) => {
          setRoomName(response.data.name);
          setPlayers(response.data.players);
        })
        .catch((error) =>
          console.error("Error al obtener información de la sala:", error)
        );
    }
  }, [roomId]);

  const handleCreateRoom = async () => {
    try {
      const response = await axios.get("http://localhost:5000/rooms/create", {
        params: { name: roomName, playerName: localStorage.getItem('username') },
      });
      setRoomId(response.data.roomId);
      alert("Sala creada exitosamente");
    } catch (error) {
      console.error("Error al crear la sala:", error);
      alert("Hubo un error al crear la sala");
    }
  };

  const handleJoinRoom = async () => {
    try {
      await axios.get(`http://localhost:5000/rooms/join/${roomIdInput}`, {
        params: { playerName: localStorage.getItem('username') },
      });
      setRoomId(roomIdInput);
      alert(`Te has unido a la sala ${roomIdInput}`);
    } catch (error) {
      console.error("Error al unirse a la sala:", error);
      alert("Hubo un error al unirse a la sala");
    }
  };

  return (
    <>
      <Nav />
      {roomId ? (
        <div>
          <h2>Lobby de la Sala (ID: {roomId})</h2>
          <p>Sala: {roomName}</p>
          <p>Jugadores:</p>
          <ul>
            {players.map((player, index) => (
              <li key={index}>{player}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <h1>Quiz Game</h1>
          <div>
            <h2>Crear Sala</h2>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Nombre de la sala"
            />
            <button onClick={handleCreateRoom}>Crear Sala</button>
          </div>
          <div>
            <h2>Unirse a una Sala</h2>
            <input
              type="text"
              value={roomIdInput}
              onChange={(e) => setRoomIdInput(e.target.value)}
              placeholder="ID de la sala"
            />
            <button onClick={handleJoinRoom}>Unirse a la Sala</button>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}

export default OnlineLanding;
