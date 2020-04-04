export type State =
  | { status: 'empty' }
  | { status: 'loading' }
  | { status: 'error', error: string }
  | { status: 'success', data: HNResponse }

type HNResponse = any

type Action =
  | { type: 'request' }
  | { type: 'success', results: HNResponse }
  | { type: 'failure', error: string };

export default function apiReducer(state: State, action: Action): State {
    switch (action.type) {
        case 'request':
            return { status: 'loading' }
        case 'success':
            return { status: 'success', data: action.results }
        case 'failure':
            return { status: 'error', error: action.error }
    }
}