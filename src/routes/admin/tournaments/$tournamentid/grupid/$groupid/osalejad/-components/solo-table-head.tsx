import { TableHead } from '@/components/ui/table'
import { useTranslation } from 'react-i18next'

const SoloTableHead = () => {
    const { t } = useTranslation()
    return (
        <>
            <TableHead className="">
                {t(
                    "admin.tournaments.groups.participants.table.serial_number"
                )}
            </TableHead>
            <TableHead className="">
                {t(
                    "admin.tournaments.groups.participants.table.position"
                )}
            </TableHead>
            <TableHead className="">
                {t(
                    "admin.tournaments.groups.participants.table.name"
                )}
            </TableHead>
            <TableHead className="">
                {t(
                    "admin.tournaments.groups.participants.table.rank"
                )}
            </TableHead>
            <TableHead className="">
                {t(
                    "admin.tournaments.groups.participants.table.sex"
                )}
            </TableHead>
            <TableHead className="">
                {t(
                    "admin.tournaments.groups.participants.table.club"
                )}
            </TableHead>
            <TableHead className="">
                {t(
                    "admin.tournaments.groups.participants.table.eltl_id"
                )}
            </TableHead>
            <TableHead className="">
                {t(
                    "admin.tournaments.groups.participants.table.rating"
                )}
            </TableHead>
            <TableHead className="">
                {t(
                    "admin.tournaments.groups.participants.table.class"
                )}
            </TableHead>
            <TableHead className="">
                {t(
                    "admin.tournaments.groups.participants.table.actions"
                )}
            </TableHead>
        </>

    )
}

export default SoloTableHead