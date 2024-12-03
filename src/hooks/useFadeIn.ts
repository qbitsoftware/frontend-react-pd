import { useEffect } from 'react'
import { useAnimation, AnimationControls } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

export const useFadeIn = (delay: number = 0): [AnimationControls, (node?: Element | null) => void] => {
    const controls = useAnimation()
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    })

    useEffect(() => {
        if (inView) {
            controls.start({
                opacity: 1,
                y: 0,
                transition: { duration: 0.5, delay }
            })
        }
    }, [controls, inView, delay])

    return [controls, ref]
}
