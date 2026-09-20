import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API } from "./utils";

// Shared Tailwind classes so every input looks the same
const inputClass = "bg-navy-800 rounded-lg p-2 w-full";

// Blank versions of each form, used to start and to reset after saving
const emptyMatch = {
  team_id: "",
  opponent: "",
  tournament_name: "",
  match_date: "",
  result: "W",
  our_sets: 0,
  opponent_sets: 0,
};

const emptyStats = {
  player_id: "",
  match_id: "",
  kills: 0,
  attempts: 0,
  errors: 0,
  digs: 0,
  aces: 0,
  blocks: 0,
  missed_serves: 0,
};

// Number fields in the stats form, in the order they appear
const statFields = ["kills", "attempts", "errors", "digs", "aces", "blocks", "missed_serves"];

function AddData() {
  // Lists for the dropdowns
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);

  // What's currently typed into each form
  const [matchForm, setMatchForm] = useState(emptyMatch);
  const [statsForm, setStatsForm] = useState(emptyStats);

  // Success or error message shown under each form
  const [matchMessage, setMatchMessage] = useState("");
  const [statsMessage, setStatsMessage] = useState("");

  // Load players and matches for the dropdowns
  function loadLists() {
    axios.get(`${API}/teams`).then((res) => setTeams(res.data));
    axios.get(`${API}/players`).then((res) => setPlayers(res.data));
    axios.get(`${API}/matches`).then((res) => setMatches(res.data));
  }

  // Run once when the page opens
  useEffect(() => {
    loadLists();
  }, []);

  // Looks up a team's name from its id, for the player dropdown
  function teamName(id) {
    const team = teams.find((t) => t.team_id === id);
    return team ? team.name : "";
  }

  // Updates one field in the match form when you type
  function handleMatchChange(e) {
    setMatchForm({ ...matchForm, [e.target.name]: e.target.value });
  }

  // Updates one field in the stats form when you type
  function handleStatsChange(e) {
    setStatsForm({ ...statsForm, [e.target.name]: e.target.value });
  }

  // Sends the new match to the API
  function submitMatch(e) {
    e.preventDefault(); // stop the page from reloading

    axios
      .post(`${API}/matches`, matchForm)
      .then(() => {
        setMatchMessage("✅ Match saved");
        setMatchForm(emptyMatch); // clear the form
        loadLists(); // so the new match shows up in the stats dropdown
      })
      .catch((err) => {
        // Show the API's error message if it sent one
        setMatchMessage("❌ " + (err.response?.data?.error || "Could not save match"));
      });
  }

  // Sends the new stat line to the API
  function submitStats(e) {
    e.preventDefault();

    axios
      .post(`${API}/stats`, statsForm)
      .then(() => {
        setStatsMessage("✅ Stats saved");
        // Keep the same match picked so you can quickly enter the next player
        setStatsForm({ ...emptyStats, match_id: statsForm.match_id });
      })
      .catch((err) => {
        setStatsMessage("❌ " + (err.response?.data?.error || "Could not save stats"));
      });
  }

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 p-8">
      <Link to="/" className="text-gold-400 hover:underline">
        ← Back to team
      </Link>

      <h1 className="text-3xl font-bold mt-4 mb-8">Add Data</h1>

      <div className="flex flex-wrap gap-8">
        {/* ---------- Form 1: add a match ---------- */}
        <form onSubmit={submitMatch} className="bg-navy-900 rounded-xl p-6 shadow-lg flex-1 min-w-[300px] flex flex-col gap-4">
          <h2 className="text-xl font-bold">New Match</h2>

          <label>
            Our team
            <select name="team_id" value={matchForm.team_id} onChange={handleMatchChange} className={inputClass} required>
              <option value="">Pick a team</option>
              {teams.map((t) => (
                <option key={t.team_id} value={t.team_id}>
                  {t.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Opponent
            <input name="opponent" value={matchForm.opponent} onChange={handleMatchChange} className={inputClass} required />
          </label>

          <label>
            Tournament
            <input name="tournament_name" value={matchForm.tournament_name} onChange={handleMatchChange} className={inputClass} />
          </label>

          <label>
            Date
            <input type="date" name="match_date" value={matchForm.match_date} onChange={handleMatchChange} className={inputClass} required />
          </label>

          <label>
            Result
            <select name="result" value={matchForm.result} onChange={handleMatchChange} className={inputClass}>
              <option value="W">Win</option>
              <option value="L">Loss</option>
            </select>
          </label>

          {/* Set score side by side */}
          <div className="flex gap-4">
            <label className="flex-1">
              Our sets
              <input type="number" min="0" name="our_sets" value={matchForm.our_sets} onChange={handleMatchChange} className={inputClass} />
            </label>
            <label className="flex-1">
              Their sets
              <input type="number" min="0" name="opponent_sets" value={matchForm.opponent_sets} onChange={handleMatchChange} className={inputClass} />
            </label>
          </div>

          <button className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold py-2 rounded-lg">
            Save Match
          </button>
          <p>{matchMessage}</p>
        </form>

        {/* ---------- Form 2: add a player's stats for a match ---------- */}
        <form onSubmit={submitStats} className="bg-navy-900 rounded-xl p-6 shadow-lg flex-1 min-w-[300px] flex flex-col gap-4">
          <h2 className="text-xl font-bold">Player Stats</h2>

          <label>
            Player
            <select name="player_id" value={statsForm.player_id} onChange={handleStatsChange} className={inputClass} required>
              <option value="">Pick a player</option>
              {players.map((p) => (
                <option key={p.player_id} value={p.player_id}>
                  {p.first_name} {p.last_name} ({teamName(p.team_id)})
                </option>
              ))}
            </select>
          </label>

          <label>
            Match
            <select name="match_id" value={statsForm.match_id} onChange={handleStatsChange} className={inputClass} required>
              <option value="">Pick a match</option>
              {matches.map((m) => (
                <option key={m.match_id} value={m.match_id}>
                  {m.match_date} vs {m.opponent}
                </option>
              ))}
            </select>
          </label>

          {/* All the number boxes, two per row */}
          <div className="grid grid-cols-2 gap-4">
            {statFields.map((field) => (
              <label key={field} className="capitalize">
                {field.replace("_", " ")}
                <input type="number" min="0" name={field} value={statsForm[field]} onChange={handleStatsChange} className={inputClass} />
              </label>
            ))}
          </div>

          <button className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold py-2 rounded-lg">
            Save Stats
          </button>
          <p>{statsMessage}</p>
        </form>
      </div>
    </div>
  );
}

export default AddData;
