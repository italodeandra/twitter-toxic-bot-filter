import { useEffect, useState } from 'react'

export default function useScrollVisible(element: HTMLElement | undefined) {
    const [ isVisible, setIsVisible ] = useState<boolean>(false)

    function checkScrollVisible() {
        const updatedIsVisible = !!element && element.scrollHeight > element.clientHeight
        setIsVisible(updatedIsVisible)
    }

    useEffect(() => {
        checkScrollVisible()

        window.addEventListener('resize', checkScrollVisible)

        return () => {
            window.removeEventListener('resize', checkScrollVisible)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ element ])

    return [ isVisible ]
}