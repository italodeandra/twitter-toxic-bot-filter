export default {
    apiHost: process.env.REACT_APP_API_HOST || 'http://192.168.17.103:3001',
    apiSocket: process.env.REACT_APP_API_SOCKET || 'ws://192.168.17.103:3001',
    twitterConsumerApiKey: process.env.REACT_APP_CONSUMER_API_KEY || 'kCkSebfJEIEx5ZPo7I7yJPub5',
    twitterConsumerApiSecretKey: process.env.REACT_APP_CONSUMER_API_SECRET_KEY || '3coFZCfs1mjzBICWuO20NwsLEgnkYqSOTPQDTmUQPBTnd0LYYA',
    twitterAuthenticateUrl: (oauthToken: string) => `https://api.twitter.com/oauth/authenticate?oauth_token=${oauthToken}`
}