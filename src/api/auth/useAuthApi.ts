import { useReducer } from 'react'
import apiReducer, { State } from '../apiReducer'
import fetch from 'cross-fetch'
import config from '../../config'

type AuthApi = [ State, {
    start(): void
    finish(oauthToken: string, oauthTokenSecret: string, oauthVerifier: string): void
} ]

export default function useAuthApi(): AuthApi {
    const [ state, dispatch ] = useReducer(apiReducer, { status: 'empty' })

    function start() {
        dispatch({ type: 'request' })

        fetch(`${config.apiHost}/user/auth-start`, {
            method: 'post'
        })
          .then(res => {
              if (res.ok) {
                  return res.json()
              } else {
                  throw res
              }
          })
          .then(
            (data) => dispatch({ type: 'success', results: data }),
            (error) => dispatch({ type: 'failure', error: typeof error.json == 'function' ? error.json() : error })
          )
    }

    function finish(oauthToken: string, oauthTokenSecret: string, oauthVerifier: string) {
        dispatch({ type: 'request' })

        fetch(`${config.apiHost}/user/auth-finish`, {
            method: 'post',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                oauthToken,
                oauthTokenSecret,
                oauthVerifier
            })
        })
          .then(res => {
              if (res.ok) {
                  return res.json()
              } else {
                  throw res
              }
          })
          .then(
            (data) => dispatch({ type: 'success', results: data }),
            (error) => dispatch({ type: 'failure', error: typeof error.json == 'function' ? error.json() : error })
          )
    }

    return [ state, { start, finish } ]
}