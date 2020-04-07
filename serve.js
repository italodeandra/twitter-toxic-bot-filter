const handler = require('serve-handler')
const http = require('http')

const server = http.createServer((request, response) => {
    // You pass two more arguments for config and middleware
    // More details here: https://github.com/zeit/serve-handler#options
    handler(request, response, {
        public: process.env.NODE_ENV === 'production' ? './build-production' : './build-staging',
        'rewrites': [
            { 'source': '**', 'destination': '/index.html' },
        ]
    })
})

server.listen(5000, () => {
    console.log('Running at http://localhost:5000')
})