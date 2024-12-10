import Board from "./board"
import TestBracket from "./testbracket"


export const Window: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-[800px] h-[500px] bg-white rounded-lg shadow-lg overflow-hidden">
                <Board>
                    <TestBracket />
                </Board>
            </div>
        </div>
    )
}