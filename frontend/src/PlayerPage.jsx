import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { API, formatPct, formatDate, hittingPct } from "./utils";

// The stat columns we show in the match table
const columns = ["kills", "attempts", "errors", "digs", "aces", "blocks", "missed_serves"];

// Turns "missed_serves" into "missed serves" for the table header
function formatLabel(field) {
  return field.replace("_", " ");
}

function PlayerPage() {
  // Grab the player id from the URL (/player/3 -> "3")
  const { id } = useParams();

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load this player's match stats whenever the id changes
  useEffect(() => {
    axios
      .get(`${API}/players/${id}`)
      .then((res) => setMatches(res.data))
      .catch(() => setError("Could not load player — is the API running?"))
      .finally(() => setLoading(false));
  }, [id]);

  // Add up one stat across all of this player's matches
  function total(field) {
    let sum = 0;
    for (const match of matches) {
      sum += match[field];
    }
    return sum;
  }

  if (loading)
    return (
      <div className="min-h-screen bg-navy-950 text-slate-400 flex items-center justify-center">
        Loading player…
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-navy-950 text-red-400 flex items-center justify-center">
        {error}
      </div>
    );

  // Every row has the player's name, so we can read it from the first one
  const playerName =
    matches.length > 0
      ? `${matches[0].first_name} ${matches[0].last_name}`
      : `Player #${id}`;

  // Season hitting % from the season totals
  const seasonPct = hittingPct(total("kills"), total("errors"), total("attempts"));

  // Data for the chart: one point per match
  const chartData = matches.map((match) => ({
    opponent: match.opponent,
    kills: match.kills,
  }));

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 p-8">
      {/* Back link to the home page */}
      <Link to="/" className="text-gold-400 hover:underline">
        ← Back to team
      </Link>

      <h1 className="text-3xl font-bold mt-4">{playerName}</h1>

      {/* Position under the name (if we have one) */}
      <p className="text-slate-400 mb-8">
        {matches.length > 0 && `${matches[0].team_name} · ${matches[0].position}`}
      </p>

      {matches.length === 0 ? (
        <p className="text-slate-400">No stats found for this player.</p>
      ) : (
        <>
          {/* Season total cards */}
          <div className="flex flex-wrap gap-4 mb-10">
            <div className="bg-navy-900 rounded-xl p-6 shadow-lg flex-1 min-w-[140px]">
              <h3 className="text-sm uppercase tracking-wide text-slate-400">Hit %</h3>
              <p className="text-4xl font-bold text-gold-400 mt-2">{formatPct(seasonPct)}</p>
            </div>
            {["kills", "digs", "aces", "blocks"].map((field) => (
              <div key={field} className="bg-navy-900 rounded-xl p-6 shadow-lg flex-1 min-w-[140px]">
                <h3 className="text-sm uppercase tracking-wide text-slate-400">{field}</h3>
                <p className="text-4xl font-bold text-gold-400 mt-2">{total(field)}</p>
              </div>
            ))}
          </div>

          {/* Kills trend chart */}
          <h2 className="text-xl font-bold mb-4">Kills per Match</h2>

          <div className="bg-navy-900 rounded-xl p-4 shadow-lg mb-10">
            {/* ResponsiveContainer makes the chart fill the box's width */}
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={chartData}>
                <CartesianGrid stroke="#1b3561" strokeDasharray="3 3" />
                <XAxis dataKey="opponent" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: "#10264a", border: "none" }} />
                <Line type="monotone" dataKey="kills" stroke="#ffcb2f" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* One row per match */}
          <h2 className="text-xl font-bold mb-4">Match by Match</h2>

          <div className="overflow-x-auto">
            <table className="w-full bg-navy-900 rounded-xl overflow-hidden shadow-lg">
              <thead>
                <tr className="bg-navy-800 text-left text-sm uppercase tracking-wide text-slate-300">
                  <th className="p-4">Date</th>
                  <th className="p-4">Opponent</th>
                  <th className="p-4">Result</th>
                  <th className="p-4">Hit %</th>
                  {columns.map((field) => (
                    <th key={field} className="p-4 capitalize">
                      {formatLabel(field)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matches.map((match) => (
                  <tr key={match.match_id} className="border-t border-navy-800 hover:bg-navy-700/50">
                    <td className="p-4">{formatDate(match.match_date)}</td>
                    <td className="p-4">{match.opponent}</td>
                    {/* Green W, red L */}
                    <td className={`p-4 font-bold ${match.result === "W" ? "text-emerald-400" : "text-red-400"}`}>
                      {match.result}
                    </td>
                    <td className="p-4">
                      {formatPct(hittingPct(match.kills, match.errors, match.attempts))}
                    </td>
                    {columns.map((field) => (
                      <td key={field} className="p-4">
                        {match[field]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default PlayerPage;
