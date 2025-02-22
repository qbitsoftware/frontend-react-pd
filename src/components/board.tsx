import useScreenSize from '@/hooks/use-screen-size';
import { ReactNode, useEffect, useState } from 'react';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'
import { useRef } from 'react';
import { ReactZoomPanPinchContentRef } from 'react-zoom-pan-pinch';

interface BoardProps {
    children: ReactNode;
}

const Board: React.FC<BoardProps> = ({ children }) => {
    const [initialScale, setInitialScale] = useState(0)
    const { width, height } = useScreenSize()
    void height

    useEffect(() => {
        switch (true) {
            case width < 768:
                setInitialScale(0.4)
                break
            case width < 1024:
                setInitialScale(0.5)
                break
            case width < 1280:
                setInitialScale(0.6)
                break
            default:
                setInitialScale(0.7)
                break
        }
    }, [width])

    const transformRef = useRef<ReactZoomPanPinchContentRef | null>(null)

    useEffect(() => {
        if (transformRef.current) {
            transformRef.current.resetTransform()
        }
    }, [initialScale])

    if (initialScale > 0) {
        return (
            <TransformWrapper
                initialScale={initialScale}
                initialPositionX={100 * initialScale}
                initialPositionY={100}
                limitToBounds={false}
                minScale={0.1}
                maxScale={2}
                wheel={{ step: 0.05 }}
                ref={transformRef}
            >
                <TransformComponent wrapperClass="w-full h-full">
                    <div className="w-[90%] h-[90%] relative">
                        {children}
                    </div>
                </TransformComponent>
            </TransformWrapper>
        )

    } else {
        return (<div>"Laadimine"</div>)
    }
}

export default Board