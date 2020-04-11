import { useReducer } from 'react'
import apiReducer, { State } from '../apiReducer'
import { useUser } from '../../store/reducers/user/userReducer'
import apiFetch from '../apiFetch'

type BotScoreApi = [ State, {
    get(names: string[]): void
} ]

export default function useBotScoreApi(initialState: State = { status: 'empty' }): BotScoreApi {
    const [ user ] = useUser()
    const [ state, dispatch ] = useReducer(apiReducer, initialState)

    function get(names: string[]) {
        dispatch({ type: 'request' })

        apiFetch(`/bot-score?names=${names.join(',')}`, {
            method: 'post',
            token: user!.token
        })
          .then(data => dispatch({ type: 'success', data }))
          .catch(error => dispatch({ type: 'failure', error }))
    }

    return [ state, { get } ]
}