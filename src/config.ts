export default {
    apiHost: 'http://192.168.17.103:3001',
    twitterConsumerApiKey: 'kCkSebfJEIEx5ZPo7I7yJPub5',
    twitterConsumerApiSecretKey: '3coFZCfs1mjzBICWuO20NwsLEgnkYqSOTPQDTmUQPBTnd0LYYA',
    twitterAuthenticateUrl: (oauthToken: string) => `https://api.twitter.com/oauth/authenticate?oauth_token=${oauthToken}`
}