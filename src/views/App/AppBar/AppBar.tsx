import React, { FunctionComponent, ReactElement, ReactNode, useEffect } from 'react'
import clsx from 'clsx'
import {
    AppBar,
    Box,
    Button,
    CircularProgress,
    Toolbar,
    Typography,
    useScrollTrigger,
    useTheme
} from '@material-ui/core'
import { Twitter as TwitterIcon } from '@material-ui/icons'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { drawerWidth } from '../App'
import MenuButton from '../MenuButton/MenuButton'
import { useUser } from '../../../store/reducers/user/userReducer'
import { updateUser } from '../../../store/reducers/user/userActions'
import UserMenu from './UserMenu/UserMenu'
import useAuthApi from '../../../api/auth/useAuthApi'
import config from '../../../config'
import { useSnackbar } from 'notistack'
import { useHistory, useLocation } from 'react-router-dom'
import { useLocalStorage } from 'react-use'
import useTitle from '../../../hooks/useTitle'

const useStyles = makeStyles((theme: Theme) => ({
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        // boxShadow: theme.shadows[0],
        transition: theme.transitions.create([ 'width', 'margin', 'box-shadow', 'background-color' ], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        color: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.contrastText

    },
    appBarShift: {
        zIndex: theme.zIndex.drawer,
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create([ 'width', 'margin', 'box-shadow', 'background-color' ], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: 'none',
    },
    title: {
        fontSize: 17
    },
    userMenuButton: {
        padding: 0,
        width: 36,
        minWidth: 36,
        height: 36,
        borderRadius: 18
    }
}))

const ElevationScroll: FunctionComponent = ({ children }) => {
    // const classes = useStyles()

    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
    })

    return React.cloneElement(children as ReactElement, {
        elevation: trigger ? 4 : 0,
        // elevation: 0,
        style: {
            // backgroundColor: !trigger ? 'transparent' : undefined
        }
    })
}

interface Props {
    isMobile: boolean
    open: boolean
    logo: ReactNode
    handleDrawerOpen: () => void
}

const AppAppBar: FunctionComponent<Props> = ({
                                                 isMobile,
                                                 open,
                                                 logo,
                                                 handleDrawerOpen,
                                             }) => {
    const theme = useTheme()
    const classes = useStyles()
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
    const [ title ] = useTitle()

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
            userDispatch(updateUser(authFinishState.data))
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
      <ElevationScroll>
          <AppBar
            position="fixed"
            className={clsx(classes.appBar, {
                [classes.appBarShift]: isSignedIn && !isMobile && open,
            })}
          >
              <Toolbar variant={!isMobile ? 'dense' : undefined}>
                  <MenuButton
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    className={classes.menuButton}
                    isMobile={isMobile}
                    open={open}
                    onClick={handleDrawerOpen}
                    location="app-bar"
                    isSignedIn={isSignedIn}
                  />

                  {logo}

                  {(title !== 'Twitter Toxic-bot Filter' || !isMobile) &&
                  <Typography variant="h6" noWrap className={classes.title}>
                      {title}
                  </Typography>
                  }

                  <div style={{ flexGrow: 1 }} />

                  <Box display="flex" alignItems="center">
                      {isSignedIn
                        ? (
                          <UserMenu />
                        ) : (<>
                            {[ authStartState.status, authFinishState.status ].includes('loading') &&
                            <CircularProgress color="inherit" size={theme.spacing(3)}
                                              style={{ marginRight: theme.spacing(2) }} />
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
              </Toolbar>
          </AppBar>
      </ElevationScroll>
    )
}

export default AppAppBar