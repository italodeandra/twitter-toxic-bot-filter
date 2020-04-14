import { State } from '../apiReducer'
import apiFetch from '../apiFetch'
import { useSharedHealthCheckApi } from '../../store/reducers/healthCheckApi/healthCheckApiReducer'

type AuthApi = [ State, () => void ]


export default function useHealthCheckApi(): AuthApi {
    const [ state, dispatch ] = useSharedHealthCheckApi()

    function ping() {
        dispatch({ type: 'request' })

        apiFetch(`/`, {
            method: 'get'
        })
          .then(data => dispatch({ type: 'success', data }))
          .catch(error => dispatch({ type: 'failure', error }))
    }

    return [ state, ping ]
}