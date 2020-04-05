export type User = {
    id: string
    screenName: string

    accessToken: string
    accessTokenSecret: string

    name?: string
    profileImageUrl?: string
}

export type NullableUser = User | null