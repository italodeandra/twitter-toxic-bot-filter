import React, { FunctionComponent } from 'react'
import { UserProvider } from './reducers/user/userReducer'
import { SharedHealthCheckApiProvider } from './reducers/healthCheckApi/healthCheckApiReducer'

const Store: FunctionComponent = ({ children }) => {
    return (
      <UserProvider>
          <SharedHealthCheckApiProvider>
              {children}
          </SharedHealthCheckApiProvider>
      </UserProvider>
    )
}

export default Store