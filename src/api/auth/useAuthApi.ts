import { useReducer } from 'react'
import apiReducer, { State } from '../apiReducer'
import apiFetch from '../apiFetch'

type AuthApi = [ State, {
    start(): void
    finish(oauthToken: string, oauthTokenSecret: string, oauthVerifier: string): void
    verify(token: string): void
} ]

export default function useAuthApi(): AuthApi {
    const [ state, dispatch ] = useReducer(apiReducer, { status: 'empty' })

    function start() {
        dispatch({ type: 'request' })

        apiFetch(`/user/auth-start`, {
            method: 'post'
        })
          .then(data => dispatch({ type: 'success', data }))
          .catch(error => dispatch({ type: 'failure', error }))
    }

    function finish(oauthToken: string, oauthTokenSecret: string, oauthVerifier: string) {
        dispatch({ type: 'request' })

        apiFetch(`/user/auth-finish`, {
            method: 'post',
            body: {
                oauthToken,
                oauthTokenSecret,
                oauthVerifier
            }
        })
          .then(data => dispatch({ type: 'success', data }))
          .catch(error => dispatch({ type: 'failure', error }))
    }

    function verify(token: string) {
        dispatch({ type: 'request' })

        apiFetch(`/user/auth-verify`, {
            method: 'get',
            token
        })
          .then(data => dispatch({ type: 'success', data }))
          .catch(error => dispatch({ type: 'failure', error }))
    }

    return [ state, { start, finish, verify } ]
}