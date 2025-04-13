import { Participant } from "@/types/participants"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { useTranslation } from "react-i18next"

const Standings = ({ participants }: { participants: Participant[] }) => {

  const {t} = useTranslation()
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">{t("competitions.standings.placement")}</TableHead>
            <TableHead>{t("competitions.standings.participants")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {participants.map((participant: Participant, index) => (
            <TableRow key={participant.id || index}>
              <TableCell className="w-16">1</TableCell>
              <TableCell>{participant.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}


export default Standings