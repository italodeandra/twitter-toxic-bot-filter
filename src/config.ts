const config: any = {
    production: {
        apiHost: 'https://twitter-toxic-bot-filter-api.italodeandra.de',
    },
    staging: {
        apiHost: 'https://twitter-toxic-bot-filter-api-staging.italodeandra.de',
    },
    development: {
        apiHost: 'http://192.168.17.103:3001',
    }
}

export default {
    twitterAuthenticateUrl: (oauthToken: string) => `https://api.twitter.com/oauth/authenticate?oauth_token=${oauthToken}`,
    ...config[process.env.REACT_APP_ENV || 'development']
}