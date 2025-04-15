import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TableCell } from '@/components/ui/table';
import { useParticipantForm } from '@/providers/participantProvider';
import { PlusCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const TeamTableInput = () => {
    const { t } = useTranslation()
    const { form, handleAddOrUpdateParticipant, participantsState } = useParticipantForm()
    return (
        <>
            <TableCell>
                {(participantsState && participantsState.length > 0
                    ? participantsState.length
                    : 0) + 1}
            </TableCell>
            <TableCell>
                <Input
                    disabled
                    className=" border-none"
                    type="text"
                />
            </TableCell>
            <TableCell className="min-w-[200px]">
                <Input
                    type="text"
                    {...form.register("name", {
                        onChange: (e) => {
                            form.setValue("name", e.target.value);
                        },
                    })}
                    placeholder="Team name"
                />
            </TableCell>
            <TableCell colSpan={6}></TableCell>
            <TableCell className="sticky right-0 p-3">
                <div className="absolute inset-0 bg-slate-200 blur-md -z-10"></div>
                <Button
                    onClick={form.handleSubmit((values) =>
                        handleAddOrUpdateParticipant(values)
                    )}
                >
                    {t(
                        "admin.tournaments.groups.participants.actions.submit"
                    )}{" "}
                    <PlusCircle />
                </Button>
            </TableCell>
        </>
    )
}

export default TeamTableInput