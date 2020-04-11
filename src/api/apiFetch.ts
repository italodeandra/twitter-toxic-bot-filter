import config from '../config'

type Options = {
    method: 'post' | 'get'
    body?: any
    token?: string
}

export default async function apiFetch(route: string, options: Options) {
    const response = await fetch(`${config.apiHost}${route}`, {
        method: options.method,
        headers: {
            'Content-type': 'application/json',
            'Authorization': options?.token!
        },
        body: options.body ? JSON.stringify(options.body) : undefined
    })

    const json = await response.json()

    if (response.ok) {
        return json
    } else {
        throw json
    }
}