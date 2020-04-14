import { useReducer } from 'react'
import apiReducer, { State } from '../apiReducer'
import { useUser } from '../../store/reducers/user/userReducer'
import Feedback from './Feedback'
import apiFetch from '../apiFetch'
import { useMountedState } from 'react-use'

type FeedbackApi = [ State, (feedback: Feedback) => void ]

export default function useFeedbackApi(): FeedbackApi {
    const [ user ] = useUser()
    const [ state, dispatch ] = useReducer(apiReducer, { status: 'empty' })
    const isMounted = useMountedState()

    function save(feedback: Feedback) {
        dispatch({ type: 'request' })

        apiFetch(`/feedback`, {
            method: 'post',
            token: user!.token,
            body: feedback
        })
          .then(data => isMounted() && dispatch({ type: 'success', data }))
          .catch(error => isMounted() && dispatch({ type: 'failure', error }))
    }

    return [ state, save ]
}