import { createReducerContext } from 'react-use'
import { NullableUser, User } from './User'
import { ActionType, UserActions } from './userActions'

let localStorageItem = window.localStorage.getItem('User') || 'null'
let localStorageUser: NullableUser = null
if (localStorage) {
    localStorageUser = JSON.parse(localStorageItem)
}
const initialState: NullableUser = localStorageUser

function reducer(state: NullableUser, action: ActionType) {
    switch (action.type) {
        case UserActions.updateUser:
            const updatedState: NullableUser = state || action.payload ? {
                ...state,
                ...action.payload
            } : null
            window.localStorage.setItem('User', JSON.stringify(updatedState))
            return updatedState
        case UserActions.removeUser:
            window.localStorage.removeItem('User')
            return null
        default:
            throw new Error()
    }
}

export const [ useUser, UserProvider ] = createReducerContext(reducer, initialState)
