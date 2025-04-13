import { UserRound } from "lucide-react"
import SoloTable from "./solo-table"
import TeamTable from "./team-table"
import { TournamentTable } from "@/types/groups"

interface GroupProps {
    group: TournamentTable
}

const Group: React.FC<GroupProps> = ({ group }) => {
    return (
        <div className=" w-full rounded-md py-6 ">
            <div className="flex justify-between">
                <div className="flex gap-6 items-center">
                    <h6 className="px-1 font-semibold">{group.class}</h6>
                    <div className="flex gap-1 justify-center items-center">
                        <UserRound className="h-5" />
                        <p className="text-lg">{group.participants.length}</p>
                    </div>
                </div>
            </div>
            <div className="mt-4 overflow-y-scroll max-h-[400px]">
                {group.solo ? <SoloTable participants={group.participants} /> : <TeamTable participants={group.participants} />}
            </div>
        </div>
    )
}

export default Group