import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { mockPlayers } from "@/lib/mock_data/player_mocks";

// Player Profile Type
export const Route = createFileRoute("/profiil/$id/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const player = mockPlayers.find(
    (player) => player.id === parseInt(id || "", 10),
  );
  const [rivals, setRivals] = useState(player && player.rivals || []);

  useEffect(() => {
    // Reset rivals every time a new player is selected
    setRivals(player && player.rivals || []);
  }, [player]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (!player) {
    return (
      <div className="text-center text-red-500 mt-20 text-xl font-semibold">
        Player not found 😢
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col">
      <header className="w-full mb-10 py-8 bg-blue-600 text-white text-center shadow-md">
        <h1 className="text-4xl font-extrabold tracking-wide">
          Eri-teadaanne: Hannes Mets astus pinksi! 🏓
        </h1>
      </header>

      {/* MAIN CONTENT */}
      <div className="max-w-6xl w-full mx-auto px-6 lg:px-12 py-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar - Profile Picture & Info */}
        <div className="flex flex-col items-center bg-white p-8 rounded-xl shadow-lg">
          <img
            src={player.photo}
            alt={player.name}
            className="w-40 h-40 rounded-full shadow-md border-4 border-blue-500"
          />
          <h2 className="text-2xl font-bold mt-4">{player.name}</h2>
          <p className="text-lg text-gray-500">{player.birthYear}</p>
          <h3 className="text-xl text-gray-600 font-semibold mt-4">
            {player.club}
          </h3>
        </div>

        {/* Main Content */}
        <div className="col-span-2 flex flex-col space-y-6">
          {/* Player Stats */}
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-2xl font-semibold mb-4 text-blue-700">
              Viimase 180 päeva statistika
            </h3>
            <div className="grid grid-cols-2 gap-6 text-lg text-gray-800">
              <p>
                <span className="font-bold">Üksikmängu kohtumisi:</span>{" "}
                {player.stats.matches}
              </p>
              <p>
                <span className="font-bold">Paarismängu kohtumisi:</span>{" "}
                {player.stats.goals}
              </p>
              <p>
                <span className="font-bold">Võistlusi:</span>{" "}
                {player.stats.assists}
              </p>
              <p>
                <span className="font-bold">Võiduprotsent:</span>{" "}
                {player.stats.winRate}%
              </p>
            </div>
          </div>

          {/* Recent Competitions */}
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-2xl font-semibold mb-4 text-blue-700">
              Hiljutised võistlused
            </h3>
            <ul className="list-disc pl-6 text-lg text-gray-700 space-y-2">
              {player.achievements.map((achievement, index) => (
                <li key={index}>{achievement}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-6xl w-full mx-auto px-6 lg:px-12 py-6">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h3 className="text-2xl font-semibold mb-6 text-blue-700">
            Viimased kohtumised
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {rivals.map((rival) => (
              <Link
                key={rival.id}
                to={`/profiil/${rival.id}`} // Navigate to rival's profile
              >
                <div
                  key={rival.id}
                  className="bg-gray-50 p-4 rounded-lg shadow-md flex flex-col items-center transition-all hover:shadow-lg hover:bg-blue-50"
                >
                  <img
                    src={rival.photo}
                    alt={rival.name}
                    className="w-20 h-20 rounded-full border-2 border-blue-400"
                  />
                  <p className="text-lg font-semibold mt-3 text-gray-800">
                    {rival.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl w-full mx-auto px-6 lg:px-12 py-6">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h3 className="text-2xl font-semibold mb-4 text-blue-700">
            Reitingu kõikumine (180 päeva)
          </h3>
          {/* <PlayerRankingChangeGraph stats={profile.rating_change}  /> */}
        </div>
      </div>

      <div className="w-full bg-white py-6 mt-6 shadow-md flex justify-center gap-6"></div>
    </div>
  );
}
