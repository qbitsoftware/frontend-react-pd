import { TournamentTable } from "@/types/types"
import { Expand, UserRound } from "lucide-react"
import SoloTable from "./solo-table"
import TeamTable from "./team-table"

interface GroupProps {
    group: TournamentTable
}

const Group: React.FC<GroupProps> = ({ group }) => {
    return (
        <div className="bg-[#F9F8F8] w-full min-h-[400px] max-h-[600px] p-6 shadow-md">
            <div className="flex justify-between">
                <div className="flex gap-6">
                    <h3 className="text-lg">{group.class}</h3>
                    <div className="flex gap-1 justify-center items-center">
                        <UserRound className="h-5" />
                        <p className="text-lg">{group.participants.length}</p>
                    </div>
                </div>
                <Expand />
            </div>
            <div className="h-[500px] mt-4">
                {group.solo ? <SoloTable participants={group.participants} /> : <TeamTable participants={group.participants}/>}
            </div>
        </div>
    )
}

export default Group