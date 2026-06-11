import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function PlayerPage() {
  const { id } = useParams();
  const [playerStats, setPlayerStats] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/players/${id}`)
      .then((res) => setPlayerStats(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  return (
    <div>
      <h1>Player Details</h1>
      <h3>Player ID: {id}</h3>

      {playerStats.length === 0 ? (
        <p>No data found</p>
      ) : (
        playerStats.map((game, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            <p>Opponent: {game.opponent}</p>
            <p>Kills: {game.kills}</p>
            <p>Aces: {game.aces}</p>
            <p>Blocks: {game.blocks}</p>
            <p>Date: {game.match_date}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default PlayerPage;