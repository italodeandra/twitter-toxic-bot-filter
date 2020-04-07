import { createGlobalState } from 'react-use'
import { useEffect } from 'react'

const useTitleGlobal = createGlobalState<string>('Twitter Toxic-bot Filter')

export default function useTitle(title?: string) {
    const [ stateTitle, setTitle ] = useTitleGlobal()

    useEffect(() => {
        if (title && stateTitle !== title) {
            setTitle(title)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ title ])

    useEffect(() => {
        window.document.title = stateTitle!
    }, [ stateTitle ])

    return [ stateTitle ]
}