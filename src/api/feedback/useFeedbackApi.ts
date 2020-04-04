import { useReducer } from 'react'
import apiReducer, { State } from '../apiReducer'
import fetch from 'cross-fetch'
import config from '../../config'

export default function useFeedbackApi(): [ State, (feedback: { rate: number, message: string }) => void ] {
    const [ state, dispatch ] = useReducer(apiReducer, { status: 'empty' })

    function save(feedback: { rate: number, message: string }) {
        dispatch({ type: 'request' })

        fetch(`${config.apiHost}/feedback`, {
            method: 'post',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(feedback)
        })
          .then(res => res.json())
          .then(
            (data) => {
                dispatch({ type: 'success', results: data })
            },
            (error) => dispatch({ type: 'failure', error }),
          )
    }

    return [ state, save ]
}