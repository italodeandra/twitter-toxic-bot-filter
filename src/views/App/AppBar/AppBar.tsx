import React, { FunctionComponent, ReactNode, useEffect } from 'react'
import { default as CAppBar } from '../../../common/components/App/AppBar/AppBar'
import { Box, Button, CircularProgress, Fade } from '@material-ui/core'
import UserMenu from '../UserMenu/UserMenu'
import { Twitter as TwitterIcon } from '@material-ui/icons'
import config from '../../../config'
import { updateUser } from '../../../store/reducers/user/userActions'
import { useUser } from '../../../store/reducers/user/userReducer'
import useAuthApi from '../../../api/auth/useAuthApi'
import { useSnackbar } from 'notistack'
import { useHistory, useLocation } from 'react-router-dom'
import { useLocalStorage } from 'react-use'
import { useTheme } from '@material-ui/core/styles'
import { appTitle } from '../App'

interface Props {
    open: boolean
    logo: ReactNode
    handleDrawerOpen: () => void
}

const AppBar: FunctionComponent<Props> = ({
                                              open,
                                              logo,
                                              handleDrawerOpen,
                                          }) => {
    const theme = useTheme()
    const [ user, userDispatch ] = useUser()
    const isSignedIn = !!user
    const [ authStartState, { start: authStart } ] = useAuthApi()
    const [ authFinishState, { finish: authFinish } ] = useAuthApi()
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()
    const location = useLocation()
    const params = Object.fromEntries(new URLSearchParams(location.search))
    const history = useHistory()
    const [ authPersistedState, setAuthPersistedState ] =
      useLocalStorage<{ oauthToken: string, oauthTokenSecret: string } | undefined>('AuthPersistedState', undefined)

    function handleSignInClick() {
        authStart()
    }

    useEffect(() => {
        if (authStartState.status === 'success') {
            const oauthToken = authStartState.data.oauthToken
            const oauthTokenSecret = authStartState.data.oauthTokenSecret
            setAuthPersistedState({
                oauthToken,
                oauthTokenSecret
            })
            window.open(config.twitterAuthenticateUrl(oauthToken), '_self')
        } else if (authStartState.status === 'error') {
            enqueueSnackbar('There was an error while trying to sign in with Twitter. Please, try again later.', {
                variant: 'error',
                persist: true,
                action: key => (
                  <Button onClick={() => closeSnackbar(key)} color="inherit">
                      Okay
                  </Button>
                )
            })
            console.error(authStartState)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ authStartState.status ])

    useEffect(() => {
        const oauthVerifier = params.oauth_verifier
        if (authPersistedState && oauthVerifier) {
            setAuthPersistedState(undefined)
            const oauthToken = authPersistedState.oauthToken
            const oauthTokenSecret = authPersistedState.oauthTokenSecret
            history.replace(history.location.pathname)
            authFinish(oauthToken, oauthTokenSecret, oauthVerifier)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (authFinishState.status === 'success') {
            const { user, token } = authFinishState.data
            user.token = token
            userDispatch(updateUser(user))
        } else if (authFinishState.status === 'error') {
            enqueueSnackbar('There was an error while trying to sign in with Twitter. Please, try again later.', {
                variant: 'error',
                persist: true,
                action: key => (
                  <Button onClick={() => closeSnackbar(key)} color="inherit">
                      Okay
                  </Button>
                )
            })
            console.error(authFinishState)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ authFinishState.status ])

    return (
      <CAppBar
        open={open}
        logo={logo}
        handleDrawerOpen={handleDrawerOpen}
        appTitle={appTitle}
        drawerShowing={isSignedIn}
      >
          <div style={{ flexGrow: 1 }} />

          <Box display="flex" alignItems="center">
              {isSignedIn
                ? (
                  <UserMenu />
                ) : (<>
                    {[ authStartState.status, authFinishState.status ].includes('loading') &&
                    <Fade in timeout={{ enter: 1000 }}>
                        <CircularProgress
                          color="inherit"
                          size={theme.spacing(3)}
                          style={{ marginRight: theme.spacing(2) }}
                        />
                    </Fade>
                    }
                    <Button
                      id="sign-in-button"
                      color="inherit"
                      variant="outlined"
                      startIcon={<TwitterIcon />}
                      disableElevation
                      onClick={handleSignInClick}
                      disabled={[ authStartState.status, authFinishState.status ].includes('loading')}
                    >Sign in
                    </Button>
                </>)
              }
          </Box>
      </CAppBar>
    )
}

export default AppBar