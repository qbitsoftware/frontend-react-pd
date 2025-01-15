import { useTranslation } from "react-i18next";

interface TopFiveProps {
  gender: string;  
  // playerid: User[] vms
}

export function TopFive({ gender }: TopFiveProps) {
    const { t } = useTranslation();
    const bestPerformersMale = [
        { nr: 1, id: "EE001", pp: 2500, rp: 2450, firstName: "Madis", lastName: "Moos", birthYear: 2004, club: "TTÜ Spordiklubi", rankChange: 2 },
        { nr: 2, id: "EE002", pp: 2450, rp: 2500, firstName: "Aleksandr", lastName: "Smirnov", birthYear: 1985, club: "LTK Kalev", rankChange: -1 },
        { nr: 3, id: "EE003", pp: 2400, rp: 2400, firstName: "Toomas", lastName: "Libene", birthYear: 1994, club: "Viimsi PINX", rankChange: 1 },
        { nr: 4, id: "EE004", pp: 2350, rp: 2350, firstName: "Osqar", lastName: "Pukk", birthYear: 2002, club: "Tartu SS Kalev", rankChange: -1 },
        { nr: 5, id: "EE005", pp: 2300, rp: 2300, firstName: "Pert Marten", lastName: "Lehtlaan", birthYear: 2007, club: "Viimsi Lauatenniseklubi", rankChange: 0 },
    ]
    const bestPerformersFemale = [
        { nr: 1, id: "EE001", pp: 2500, rp: 2450, firstName: "Airi", lastName: "Avameri", birthYear: 1998, club: "TTÜ Spordiklubi", rankChange: 2 },
        { nr: 2, id: "EE002", pp: 2450, rp: 2500, firstName: "Reelica", lastName: "Hanson", birthYear: 1999, club: "TTÜ Spordiklubi", rankChange: -1 },
        { nr: 3, id: "EE003", pp: 2400, rp: 2400, firstName: "Arina", lastName: "Litvinova", birthYear: 2006, club: "Narva Paemurru Spordikool", rankChange: 1 },
        { nr: 4, id: "EE004", pp: 2350, rp: 2350, firstName: "Kätlin", lastName: "Põldveer", birthYear: 1985, club: "LTK Kalev", rankChange: -1 },
        { nr: 5, id: "EE005", pp: 2300, rp: 2300, firstName: "Vitalia", lastName: "Reinol", birthYear: 2003, club: "TTÜ SPordiklubi", rankChange: 0 },
    ]
     let bestPerformers
     if (gender === "men") {
       bestPerformers = bestPerformersMale
     }else if (gender === "women") {
       bestPerformers = bestPerformersFemale 
     }
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
