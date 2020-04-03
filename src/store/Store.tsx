import React, { FunctionComponent } from 'react'
import { UserProvider } from './reducers/user/userReducer'

const Store: FunctionComponent = ({ children }) => {
    return (
      <UserProvider>
          {children}
      </UserProvider>
    )
}

export default Store