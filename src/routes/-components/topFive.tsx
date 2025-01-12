import { useTranslation } from "react-i18next";

interface TopFiveProps {
  gender: string;  
  // playerid: User[] vms
}

export function TopFive({ gender }: TopFiveProps) {
    const { t } = useTranslation();
    const bestPerformers = [
        { nr: 1, id: "EE001", pp: 2500, rp: 2450, firstName: "Andres", lastName: "Kask", birthYear: 1995, club: "Tallinn TTC", rankChange: 2 },
        { nr: 2, id: "EE002", pp: 2450, rp: 2500, firstName: "Maria", lastName: "Tamm", birthYear: 1997, club: "Tartu PP", rankChange: -1 },
        { nr: 3, id: "EE003", pp: 2400, rp: 2400, firstName: "Jaan", lastName: "Lepp", birthYear: 1993, club: "Pärnu Paddlers", rankChange: 1 },
        { nr: 4, id: "EE004", pp: 2350, rp: 2350, firstName: "Liis", lastName: "Kuusk", birthYear: 1999, club: "Narva Net Smashers", rankChange: -1 },
        { nr: 5, id: "EE005", pp: 2300, rp: 2300, firstName: "Mart", lastName: "Mägi", birthYear: 1996, club: "Viljandi Victory", rankChange: 0 },
    ]
    return (
      <div className="w-full max-w-6xl mx-auto py-4">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-secondary text-white py-3 px-6">
            <h2 className="text-xl font-bold tracking-wide">{t(`homepage.top_players.titles.${gender}`)}</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full bg-white">
              <tbody className="divide-y divide-gray-200">
                {bestPerformers.map((performer) => (
                  <tr
                    key={performer.id}
                    className="hover:bg-gray-50 transition duration-200"
                  >
                    <td
                      className={`px-6 py-4 text-sm font-medium ${
                      performer.nr === 1
                        ? "text-yellow-500 font-extrabold" 
                        : performer.nr === 2
                        ? "text-gray-400 font-extrabold" 
                        : performer.nr === 3
                        ? "text-orange-800 font-extrabold" 
                        : "text-gray-900"
                      }`}
                      >
                        {performer.nr}
                      </td>
                    <td className="px-6 py-4 text-sm text-black font-semibold">
                      <div className="flex items-center">
                        <img
                          src={'../../../public/test/placeholder-player-profilepic.png'}
                          alt={`${performer.firstName} ${performer.lastName}`}
                          className="w-8 h-8 rounded-full mr-3" 
                        />
                        {performer.firstName} {performer.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{performer.club}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
}
