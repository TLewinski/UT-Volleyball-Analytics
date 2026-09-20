import { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import PlayerPage from "./PlayerPage";
import AddData from "./AddData";
import { API, formatPct, formatDate } from "./utils";

// Reusable card — used for each number at the top of the page
function StatCard({ label, value }) {
  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-lg flex-1 min-w-[140px]">
      <h3 className="text-sm uppercase tracking-wide text-slate-400">{label}</h3>
      <p className="text-4xl font-bold text-emerald-400 mt-2">{value}</p>
    </div>
  );
}

function Home() {
  const [summary, setSummary] = useState({});
  const [totals, setTotals] = useState([]);
  const [record, setRecord] = useState({ wins: 0, losses: 0 });
  const [matches, setMatches] = useState([]);
  const [sortField, setSortField] = useState("kills");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fire all requests at once; wait for all of them before showing data
    Promise.all([
      axios.get(`${API}/stats/summary`),
      axios.get(`${API}/players/totals`),
      axios.get(`${API}/matches/record`),
      axios.get(`${API}/matches`),
    ])
      .then(([summaryRes, totalsRes, recordRes, matchesRes]) => {
        setSummary(summaryRes.data);
        setTotals(totalsRes.data);
        setRecord(recordRes.data);
        setMatches(matchesRes.data);
      })
      .catch(() => setError("Could not load data — is the API running?"))
      .finally(() => setLoading(false));
  }, []);

  // Re-computed on every render; spread copies the array so we never mutate state
  const sortedTotals = [...totals].sort((a, b) => b[sortField] - a[sortField]);

  // Columns in the player table (hitting_pct gets special formatting below)
  const columns = ["kills", "attempts", "hitting_pct", "digs", "aces", "blocks"];

  // Nicer header text for columns with underscores
  function columnLabel(field) {
    if (field === "hitting_pct") return "Hit %";
    return field;
  }

  if (loading)
    return (
      <div className="min-h-screen bg-slate-900 text-slate-400 flex items-center justify-center">
        Loading season stats…
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-slate-900 text-red-400 flex items-center justify-center">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
      {/* Title and a link to the data entry page */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          UT Volleyball <span className="text-emerald-400">Analytics</span>
        </h1>
        <Link
          to="/add"
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold px-4 py-2 rounded-lg"
        >
          + Add Data
        </Link>
      </div>

      {/* Team summary cards */}
      <div className="flex flex-wrap gap-4 mb-10">
        <StatCard label="Record" value={`${record.wins}-${record.losses}`} />
        <StatCard label="Hit %" value={formatPct(summary.hitting_pct)} />
        <StatCard label="Kills" value={summary.total_kills} />
        <StatCard label="Aces" value={summary.total_aces} />
        <StatCard label="Blocks" value={summary.total_blocks} />
      </div>

      <h2 className="text-xl font-bold mb-4">Player Season Totals</h2>

      <div className="overflow-x-auto mb-10">
        <table className="w-full bg-slate-800 rounded-xl overflow-hidden shadow-lg">
          <thead>
            <tr className="bg-slate-700 text-left text-sm uppercase tracking-wide text-slate-300">
              <th className="p-4">Player</th>
              {columns.map((field) => (
                <th
                  key={field}
                  onClick={() => setSortField(field)}
                  className={`p-4 cursor-pointer capitalize hover:text-emerald-300 ${
                    sortField === field ? "text-emerald-400" : ""
                  }`}
                >
                  {columnLabel(field)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedTotals.map((player) => (
              <tr
                key={player.player_id}
                className="border-t border-slate-700 hover:bg-slate-700/50"
              >
                <td className="p-4">
                  <Link
                    to={`/player/${player.player_id}`}
                    className="text-emerald-400 hover:underline"
                  >
                    {player.first_name} {player.last_name}
                  </Link>
                </td>
                {columns.map((field) => (
                  <td key={field} className="p-4">
                    {/* Hitting % shows as .325; everything else shows as-is */}
                    {field === "hitting_pct" ? formatPct(player[field]) : player[field]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Every match with its result */}
      <h2 className="text-xl font-bold mb-4">Match Results</h2>

      <div className="flex flex-col gap-2">
        {matches.map((match) => (
          <div
            key={match.match_id}
            className="bg-slate-800 rounded-lg p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-bold">vs {match.opponent}</p>
              <p className="text-sm text-slate-400">
                {formatDate(match.match_date)} · {match.tournament_name}
              </p>
            </div>

            {/* Green for a win, red for a loss */}
            <p
              className={`text-xl font-bold ${
                match.result === "W" ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {match.result}
              {/* Only show the set score if one was entered (not 0-0) */}
              {match.our_sets + match.opponent_sets > 0 &&
                ` ${match.our_sets}-${match.opponent_sets}`}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/player/:id" element={<PlayerPage />} />
        <Route path="/add" element={<AddData />} />
      </Routes>
    </BrowserRouter>
  );
}
