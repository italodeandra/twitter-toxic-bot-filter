import { useReducer } from 'react'
import apiReducer, { State } from '../apiReducer'
import fetch from 'cross-fetch'
import config from '../../config'
import { useUser } from '../../store/reducers/user/userReducer'
import TweetTrap from './TweetTrap'

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

        fetch(`${config.apiHost}/tweet-trap`, {
            method: 'post',
            headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + btoa(JSON.stringify(user))
            },
            body: JSON.stringify(tweetTrap)
        })
          .then(res => {
              if (res.ok) {
                  return res.json()
              } else {
                  throw res.json()
              }
          })
          .then(
            (data) => dispatch({ type: 'success', results: data }),
            (errorP) => errorP.then((error: any) => dispatch({ type: 'failure', error }))
          )
    }

    function get(id: string) {
        dispatch({ type: 'request' })

        fetch(`${config.apiHost}/tweet-trap/${id}`, {
            method: 'get',
            headers: {
                'Authorization': 'Bearer ' + btoa(JSON.stringify(user))
            }
        })
          .then(res => {
              if (res.ok) {
                  return res.json()
              } else {
                  throw res.json()
              }
          })
          .then(
            (data) => dispatch({ type: 'success', results: data }),
            (errorP) => errorP.then((error: any) => dispatch({ type: 'failure', error }))
          )
    }

    function list() {
        dispatch({ type: 'request' })

        fetch(`${config.apiHost}/tweet-trap`, {
            method: 'get',
            headers: {
                'Authorization': 'Bearer ' + btoa(JSON.stringify(user))
            }
        })
          .then(res => {
              if (res.ok) {
                  return res.json()
              } else {
                  throw res.json()
              }
          })
          .then(
            (data) => dispatch({ type: 'success', results: data }),
            (errorP) => errorP.then((error: any) => dispatch({ type: 'failure', error }))
          )
    }

    function getReplies(id: string) {
        dispatch({ type: 'request' })

        fetch(`${config.apiHost}/tweet-trap/${id}/replies`, {
            method: 'get',
            headers: {
                'Authorization': 'Bearer ' + btoa(JSON.stringify(user))
            }
        })
          .then(res => {
              if (res.ok) {
                  return res.json()
              } else {
                  throw res.json()
              }
          })
          .then(
            (data) => dispatch({ type: 'success', results: data }),
            (errorP) => errorP.then((error: any) => dispatch({ type: 'failure', error }))
          )
    }

    function manualUpdateData(data: any) {
        dispatch({ type: 'success', results: data })
    }

    return [ state, { tweet, get, list, getReplies, manualUpdateData } ]
}