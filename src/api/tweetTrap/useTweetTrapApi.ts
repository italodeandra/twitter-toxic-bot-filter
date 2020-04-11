import { useReducer } from 'react'
import apiReducer, { State } from '../apiReducer'
import { useUser } from '../../store/reducers/user/userReducer'
import TweetTrap from './TweetTrap'
import apiFetch from '../apiFetch'

type TweetTrapApi = [ State, {
    tweet(tweetTrap: TweetTrap): void
    get(id: string): void
    list(): void
    getReplies(id: string): void
    manualUpdateData(data: any): void
} ]

export default function useTweetTrapApi(initialState: State = { status: 'empty' }): TweetTrapApi {
    const [ user ] = useUser()
    const [ state, dispatch ] = useReducer(apiReducer, initialState)

    function tweet(tweetTrap: TweetTrap) {
        dispatch({ type: 'request' })

        apiFetch(`/tweet-trap`, {
            method: 'post',
            token: user!.token,
            body: tweetTrap
        })
          .then(data => dispatch({ type: 'success', data }))
          .catch(error => dispatch({ type: 'failure', error }))
    }

    function get(id: string) {
        dispatch({ type: 'request' })

        apiFetch(`/tweet-trap/${id}`, {
            method: 'get',
            token: user!.token
        })
          .then(data => dispatch({ type: 'success', data }))
          .catch(error => dispatch({ type: 'failure', error }))
    }

    function list() {
        dispatch({ type: 'request' })

        apiFetch(`/tweet-trap`, {
            method: 'get',
            token: user!.token
        })
          .then(data => dispatch({ type: 'success', data }))
          .catch(error => dispatch({ type: 'failure', error }))
    }

    function getReplies(id: string) {
        dispatch({ type: 'request' })

        apiFetch(`/tweet-trap/${id}/replies`, {
            method: 'get',
            token: user!.token
        })
          .then(data => dispatch({ type: 'success', data }))
          .catch(error => dispatch({ type: 'failure', error }))
    }

    function manualUpdateData(data: any) {
        dispatch({ type: 'success', data: data })
    }

    return [ state, { tweet, get, list, getReplies, manualUpdateData } ]
}