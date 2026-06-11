import { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import PlayerPage from "./PlayerPage";

// API base URL comes from .env so it can change at deploy time without code edits
const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Reusable card — one component, used three times below
function StatCard({ label, value }) {
  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-lg flex-1">
      <h3 className="text-sm uppercase tracking-wide text-slate-400">{label}</h3>
      <p className="text-4xl font-bold text-emerald-400 mt-2">{value}</p>
    </div>
  );
}

function Home() {
  const [summary, setSummary] = useState({});
  const [totals, setTotals] = useState([]);
  const [sortField, setSortField] = useState("kills");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fire both requests at once; wait for both before rendering data
    Promise.all([
      axios.get(`${API}/stats/summary`),
      axios.get(`${API}/players/totals`),
    ])
      .then(([summaryRes, totalsRes]) => {
        setSummary(summaryRes.data);
        setTotals(totalsRes.data);
      })
      .catch(() => setError("Could not load data — is the API running?"))
      .finally(() => setLoading(false));
  }, []);

  // Re-computed on every render; spread copies the array so we never mutate state
  const sortedTotals = [...totals].sort((a, b) => b[sortField] - a[sortField]);

  const columns = ["kills", "digs", "aces", "blocks"];

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
      <h1 className="text-3xl font-bold mb-8">
        UT Volleyball <span className="text-emerald-400">Analytics</span>
      </h1>

      <div className="flex gap-4 mb-10">
        <StatCard label="Kills" value={summary.total_kills} />
        <StatCard label="Aces" value={summary.total_aces} />
        <StatCard label="Blocks" value={summary.total_blocks} />
      </div>

      <h2 className="text-xl font-bold mb-4">Player Season Totals</h2>

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
                {field}
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
                  {player[field]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/player/:id" element={<PlayerPage />} />
      </Routes>
    </BrowserRouter>
  );
}