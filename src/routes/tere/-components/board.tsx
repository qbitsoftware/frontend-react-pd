import { Button } from '@/components/ui/button'
import { ReactNode } from '@tanstack/react-router';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'

interface BoardProps {
    children: ReactNode;
}

const Board: React.FC<BoardProps> = ({ children }) => {
    return (
        <TransformWrapper
            initialScale={0.7}
            initialPositionX={100}
            initialPositionY={100}
            limitToBounds={false}
            minScale={0.1}
            maxScale={3}
            wheel={{ step: 0.05 }}
        >
            {({ resetTransform }) => (
                <>
                    <div className="absolute top-50 left-50 z-10 flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => resetTransform()}>
                            Reset
                        </Button>
                    </div>
                    <TransformComponent wrapperClass="w-full h-full">
                        <div className="w-[5000px] h-[5000px] bg-white relative">
                            {children}
                        </div>
                    </TransformComponent>
                </>
            )}
        </TransformWrapper>
    )

}

export default Board