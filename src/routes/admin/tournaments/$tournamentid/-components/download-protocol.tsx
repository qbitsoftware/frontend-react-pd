import { Button } from "@/components/ui/button";
import { downloadExcelFile, UseGetDownloadProtocol } from "@/queries/download";

export function ProtocolDownloadButton({ tournament_id, group_id, match_id }: {tournament_id: number, group_id: number, match_id: string}) {
        const { data, isLoading } = UseGetDownloadProtocol(tournament_id, group_id, match_id);

    const handleDownload = () => {
        if (data) {
            downloadExcelFile(data, `protocol_${match_id}.xlsx`);
        }
    };
    
    return (
        <Button
            onClick={handleDownload} 
            disabled={isLoading || !data}
            variant="outline"
            className="ml-4"
        >
            {isLoading ? 'Loading...' : 'Download Protocol'}
        </Button>
    );
}
