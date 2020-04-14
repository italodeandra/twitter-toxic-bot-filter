import { useReducer } from 'react'
import apiReducer, { State } from '../apiReducer'
import apiFetch from '../apiFetch'
import { useMountedState } from 'react-use'

type AuthApi = [ State, {
    start(): void
    finish(oauthToken: string, oauthTokenSecret: string, oauthVerifier: string): void
    verify(token: string): void
} ]

export default function useAuthApi(): AuthApi {
    const [ state, dispatch ] = useReducer(apiReducer, { status: 'empty' })
    const isMounted = useMountedState()

    function start() {
        dispatch({ type: 'request' })

        apiFetch(`/user/auth-start`, {
            method: 'post'
        })
          .then(data => isMounted() && dispatch({ type: 'success', data }))
          .catch(error => isMounted() && dispatch({ type: 'failure', error }))
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
          .then(data => isMounted() && dispatch({ type: 'success', data }))
          .catch(error => isMounted() && dispatch({ type: 'failure', error }))
    }

    function verify(token: string) {
        dispatch({ type: 'request' })

        apiFetch(`/user/auth-verify`, {
            method: 'get',
            token
        })
          .then(data => isMounted() && dispatch({ type: 'success', data }))
          .catch(error => isMounted() && dispatch({ type: 'failure', error }))
    }

    return [ state, { start, finish, verify } ]
}