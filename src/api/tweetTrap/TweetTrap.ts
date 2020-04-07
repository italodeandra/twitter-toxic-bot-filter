import { User } from '../../store/reducers/user/User'

export default interface TweetTrap {
    id?: string
    text: string
    createdBy?: User
    createdAt?: Date

    botScore?: number
}