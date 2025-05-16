import { Button } from "@/components/ui/button";
import { downloadExcelFile, UseGetDownloadProtocol } from "@/queries/download";
import { useTranslation } from "react-i18next";

export function ProtocolDownloadButton({ tournament_id, group_id, match_id }: { tournament_id: number, group_id: number, match_id: string }) {
    const { data, isLoading } = UseGetDownloadProtocol(tournament_id, group_id, match_id);

    const handleDownload = () => {
        if (data) {
            downloadExcelFile(data, `protocol_${match_id}.xlsx`);
        }
    };

    const { t } = useTranslation();

    return (
        <Button
            onClick={handleDownload}
            disabled={isLoading || !data}
            variant="outline"
            className="ml-4"
        >
            {isLoading ? t('protocol.loading') : t('protocol.download')}
        </Button>
    );
}
