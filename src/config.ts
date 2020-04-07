const config: any = {
    production: {
        apiHost: 'https://twitter-toxic-bot-filter-api.italodeandra.de',
        apiSocket: 'ws://twitter-toxic-bot-filter-api.italodeandra.de',
    },
    staging: {
        apiHost: 'https://twitter-toxic-bot-filter-api-staging.italodeandra.de',
        apiSocket: 'ws://twitter-toxic-bot-filter-api-staging.italodeandra.de',
    },
    development: {
        apiHost: 'http://192.168.17.103:3001',
        apiSocket: 'ws://192.168.17.103:3001',
    }
}

export default {
    twitterConsumerApiKey: process.env.REACT_APP_CONSUMER_API_KEY || 'kCkSebfJEIEx5ZPo7I7yJPub5',
    twitterConsumerApiSecretKey: process.env.REACT_APP_CONSUMER_API_SECRET_KEY || '3coFZCfs1mjzBICWuO20NwsLEgnkYqSOTPQDTmUQPBTnd0LYYA',
    twitterAuthenticateUrl: (oauthToken: string) => `https://api.twitter.com/oauth/authenticate?oauth_token=${oauthToken}`,
    ...config[process.env.REACT_APP_ENV || 'development']
}