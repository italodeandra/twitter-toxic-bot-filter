import { createReducerContext } from 'react-use'
import apiReducer from '../../../api/apiReducer'

export const [ useSharedHealthCheckApi, SharedHealthCheckApiProvider ] = createReducerContext(apiReducer, { status: 'loading' })
