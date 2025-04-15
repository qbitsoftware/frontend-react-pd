import { useToastNotification } from '@/components/toast-notification'
import { Button } from '@/components/ui/button'
import { CardHeader } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { MatchesResponse, UseGetMatchesQuery } from '@/queries/match'
import { UsePostOrder } from '@/queries/participants'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import seeds3 from "@/assets/seeds3.png";

interface SeedingHeaderProps {
    tournament_id: number;
    tournament_table_id: number;
}

const SeedingHeader = ({ tournament_id, tournament_table_id }: SeedingHeaderProps) => {
    const { data: matches_data } = UseGetMatchesQuery(
        tournament_id,
        tournament_table_id,
    );
    const updateOrdering = UsePostOrder(tournament_id, tournament_table_id);

    const [disabled, setDisabled] = useState(false);
    const isDisabled = (data: MatchesResponse | undefined): boolean => {
        if (!data || !data.data) {
            return false;
        }
        const winners = data.data.find((match) => {
            return match.match.winner_id != "";
        });

        if (!winners) {
            return false;
        } else {
            return true;
        }
    };

    useEffect(() => {
        setDisabled(isDisabled(matches_data));
    }, [matches_data]);



    const toast = useToast()
    const { successToast, errorToast } = useToastNotification(toast)
    const { t } = useTranslation()
    const [selectedOrderValue, setSelectedOrderValue] = useState<
        string | undefined
    >();

    const handleOrder = async (order: string | undefined) => {
        if (!order) {
            return;
        }
        try {
            const res = await updateOrdering.mutateAsync({ order });
            successToast(res.message);
        } catch (error) {
            void error;
            errorToast("Error", "Failed to seed participants")
        }
    };

    return (
        <CardHeader className="flex flex-row items-center justify-between">
            <p className="pl-1  text-sm">Status: <span className="bg-[#FBFBFB] font-medium px-3 py-1 rounded-full border border-[#EAEAEA]">Unseeded</span></p>
            <div className="flex gap-4">
                <Select
                    onValueChange={setSelectedOrderValue}
                    defaultValue={selectedOrderValue}
                    disabled={disabled}
                >
                    <SelectTrigger className="">
                        <SelectValue
                            placeholder={t(
                                "admin.tournaments.groups.order.placeholder"
                            )}
                        />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="random">
                            {t("admin.tournaments.groups.order.random")}
                        </SelectItem>
                        <SelectItem value="rating">
                            {t("admin.tournaments.groups.order.by_rating")}
                        </SelectItem>
                        <SelectItem value="regular">
                            {t("admin.tournaments.groups.order.by_order")}
                        </SelectItem>
                    </SelectContent>
                </Select>
                <Button
                    disabled={!selectedOrderValue}
                    onClick={() => handleOrder(selectedOrderValue)}
                    className="flex p-0 justify-between items-center px-4"
                >
                    <div className="flex flex-row pr-6 gap-2">
                        {t("admin.tournaments.groups.order.title")}{" "}
                        <img src={seeds3} className="h-5 w-5 object-contain" />
                    </div>
                </Button>
            </div>

        </CardHeader>
    )
}

export default SeedingHeader