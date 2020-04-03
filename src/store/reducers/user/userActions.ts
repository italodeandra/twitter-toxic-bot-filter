import { User } from './User'

export enum UserActions {
    updateUser = 'updateUser',
    removeUser = 'removeUser'
}

export type ActionType =
  | { type: UserActions.updateUser, payload: User }
  | { type: UserActions.removeUser }

export function updateUser(user: User): ActionType {
    return {
        type: UserActions.updateUser,
        payload: user
    }
}

export function removeUser(): ActionType {
    return {
        type: UserActions.removeUser,
    }
}