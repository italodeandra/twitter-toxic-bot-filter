import { useReducer } from 'react'
import apiReducer, { State } from '../apiReducer'
import fetch from 'cross-fetch'
import config from '../../config'
import { useUser } from '../../store/reducers/user/userReducer'

type BotScoreApi = [ State, {
    get(names: string[]): void
} ]

export default function useBotScoreApi(initialState: State = { status: 'empty' }): BotScoreApi {
    const [ user ] = useUser()
    const [ state, dispatch ] = useReducer(apiReducer, initialState)

    function get(names: string[]) {
        dispatch({ type: 'request' })

        fetch(`${config.apiHost}/bot-score?names=${names.join(',')}`, {
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

    return [ state, { get } ]
}