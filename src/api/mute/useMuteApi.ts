import { useReducer } from 'react'
import apiReducer, { State } from '../apiReducer'
import fetch from 'cross-fetch'
import config from '../../config'
import { useUser } from '../../store/reducers/user/userReducer'

type MuteApi = [ State, {
    mute(names: string[]): void
} ]

export default function useMuteApi(initialState: State = { status: 'empty' }): MuteApi {
    const [ user ] = useUser()
    const [ state, dispatch ] = useReducer(apiReducer, initialState)

    function mute(names: string[]) {
        dispatch({ type: 'request' })

        fetch(`${config.apiHost}/mute`, {
            method: 'post',
            headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + btoa(JSON.stringify(user))
            },
            body: JSON.stringify({ names })
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

    return [ state, { mute } ]
}