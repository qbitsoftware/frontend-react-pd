import { Score } from "@/types/types"

interface ScoreFormProps {
    matchId: string
    score: Score[]
}

export const ScoreForm: React.FC<ScoreFormProps> = ({ matchId, score}) => {
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // Handle form submission logic here
    };

    return (
       <>
       </>
    );
}