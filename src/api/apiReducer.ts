export type State =
  | { status: 'empty' }
  | { status: 'loading' }
  | { status: 'error', error: any }
  | { status: 'success', data: any }

type Action =
  | { type: 'request' }
  | { type: 'success', data: any }
  | { type: 'failure', error: string }

export default function apiReducer(state: State, action: Action): State {
    switch (action.type) {
        case 'request':
            return { status: 'loading' }
        case 'success':
            return { status: 'success', data: action.data }
        case 'failure':
            return { status: 'error', error: action.error }
    }
}