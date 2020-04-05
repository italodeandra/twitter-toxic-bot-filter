import { useReducer } from 'react'
import apiReducer, { State } from '../apiReducer'
import fetch from 'cross-fetch'
import config from '../../config'
import { useUser } from '../../store/reducers/user/userReducer'

export default function useFeedbackApi(): [ State, (feedback: { rate: number, message: string }) => void ] {
    const [ user ] = useUser()
    const [ state, dispatch ] = useReducer(apiReducer, { status: 'empty' })

    function save(feedback: { rate: number, message: string }) {
        dispatch({ type: 'request' })

        fetch(`${config.apiHost}/feedback`, {
            method: 'post',
            headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + btoa(JSON.stringify(user))
            },
            body: JSON.stringify(feedback)
        })
          .then(res => {
              if (res.ok) {
                  return res.json()
              } else {
                  throw res
              }
          })
          .then(
            (data) => {
                dispatch({ type: 'success', results: data })
            },
            (error) => dispatch({ type: 'failure', error: typeof error.json == 'function' ? error.json() : error })
          )
    }

    return [ state, save ]
}