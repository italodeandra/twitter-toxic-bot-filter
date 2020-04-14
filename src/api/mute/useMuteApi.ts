import { useReducer } from 'react'
import apiReducer, { State } from '../apiReducer'
import { useUser } from '../../store/reducers/user/userReducer'
import apiFetch from '../apiFetch'
import { useMountedState } from 'react-use'

type MuteApi = [ State, {
    mute(names: string[]): void
} ]

export default function useMuteApi(initialState: State = { status: 'empty' }): MuteApi {
    const [ user ] = useUser()
    const [ state, dispatch ] = useReducer(apiReducer, initialState)
    const isMounted = useMountedState()

    async function mute(names: string[]) {
        dispatch({ type: 'request' })

        apiFetch(`/mute`, {
            method: 'post',
            token: user!.token,
            body: { names }
        })
          .then(data => isMounted() && dispatch({ type: 'success', data }))
          .catch(error => isMounted() && dispatch({ type: 'failure', error }))
    }

    return [ state, { mute } ]
}