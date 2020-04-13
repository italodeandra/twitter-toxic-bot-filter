const config: any = {
    production: {
        apiHost: 'https://twitter-toxic-bot-filter-api.italodeandra.de',
    },
    staging: {
        apiHost: 'https://twitter-toxic-bot-filter-api-staging.italodeandra.de',
    },
    development: {
        apiHost: 'http://localhost:3001',
    }
}

export default {
    twitterAuthenticateUrl: (oauthToken: string) => `https://api.twitter.com/oauth/authenticate?oauth_token=${oauthToken}`,
    ...config[process.env.NODE_ENV || 'development']
}