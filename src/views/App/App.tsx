import React, { useEffect, useMemo } from 'react'
import { createMuiTheme, makeStyles, Theme, ThemeProvider, useTheme } from '@material-ui/core/styles'
import { BrowserRouter as Router, Link, Redirect, Route, Switch } from 'react-router-dom'
import Welcome from '../Welcome/Welcome'
import { lightBlue } from '@material-ui/core/colors'
import { Box, Button, CircularProgress, CssBaseline, Fade, useMediaQuery } from '@material-ui/core'
import {
    HomeRounded as HomeRoundedIcon,
    PolicyRounded as PolicyRoundedIcon,
    TrackChangesRounded as TrackChangesRoundedIcon
} from '@material-ui/icons'
import { useDeepCompareEffect, useLocalStorage, useMount } from 'react-use'
import AppDrawer, { toolbarStyles } from './Drawer/AppDrawer'
import AppAppBar from './AppBar/AppBar'
import { useUser } from '../../store/reducers/user/userReducer'
import Home from '../Home/Home'
import TweetTrap from '../TweetTrap/TweetTrap'
import { SnackbarProvider, useSnackbar } from 'notistack'
import TweetTrapSelected from '../TweetTrap/Selected/TweetTrapSelected'
import useSocket from '../../hooks/useSocket'
import NotFound from '../NotFound/NotFound'
import useAuthApi from '../../api/auth/useAuthApi'
import { removeUser, updateUser } from '../../store/reducers/user/userActions'
import Terms from '../Terms/Terms'
import Privacy from '../Privacy/Privacy'
import ServerDown from '../ServerDown/ServerDown'
import useHealthCheckApi from '../../api/healthCheck/useHealthCheckApi'

export const drawerWidth = 240

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: 'flex',
    },

    logo: {
        display: 'flex',
        color: 'inherit',
        marginRight: theme.spacing(2),
    },

    toolbar: {
        ...toolbarStyles(theme),
    },

    content: {
        flexGrow: 1
    },
    loading: {
        height: theme.spacing(18),
        '&': {
            height: 'calc(100vh - ' + toolbarStyles(theme).minHeight.replace(' !important', '') + ')',
        },
        color: theme.palette.grey['400']
    },
}))

const menus = [
    { title: 'Home', icon: <HomeRoundedIcon />, url: '/', exact: true },
    { title: 'Tweet trap', icon: <TrackChangesRoundedIcon />, url: '/tweet-trap' }
]

function AppWithProviders() {
    const theme = useTheme()
    const classes = useStyles()
    const isMobile = useMediaQuery(theme.breakpoints.down('xs'), { noSsr: true })
    const [ open, setOpen ] = useLocalStorage<boolean>('NavigationDrawerOpen', false)
    const [ user, userDispatch ] = useUser()
    const isSignedIn = !!user
    const [ authVerifyState, { verify: authVerify } ] = useAuthApi()
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()
    const [ healthCheckState, ping ] = useHealthCheckApi()
    const isServerDown = (healthCheckState.status === 'error')

    useMount(() => {
        ping()

        if (isSignedIn) {
            authVerify(user!.token!)
        }
    })

    const socket = useSocket()
    useMount(() => {
        socket.on('reconnect', () => {
            socket.emit('auth', user)
        })
        socket.on('authenticated', (authenticated: boolean) => {
            (socket as any).authenticated = authenticated
        })
    })
    useDeepCompareEffect(() => {
        socket.emit('auth', user)
    }, [ user ])

    const logo = useMemo(() => (
      <Link
        to="/"
        className={classes.logo}
      >
          <PolicyRoundedIcon
            aria-label="twitter toxic-bot filter's logo"
          />
      </Link>
    ), [ classes ])

    function handleDrawerOpen() {
        setOpen(true)
    }

    function handleDrawerClose() {
        setOpen(false)
    }

    useEffect(() => {
        if (authVerifyState.status === 'success') {
            const { user, token } = authVerifyState.data
            user.token = token
            userDispatch(updateUser(user))
        } else if (authVerifyState.status === 'error') {
            if (authVerifyState.error.statusCode === 401) {
                userDispatch(removeUser())
            }
            if (authVerifyState.error.message !== 'Failed to fetch') {
                enqueueSnackbar(authVerifyState.error.message, {
                    variant: 'error',
                    persist: true,
                    action: key => (
                      <Button onClick={() => closeSnackbar(key)} color="inherit">
                          Okay
                      </Button>
                    )
                })
            }
            console.error(authVerifyState)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ authVerifyState.status ])

    return (
      <div className={classes.root}>

          {!isServerDown ? <>
              <AppAppBar
                isMobile={isMobile}
                open={open}
                logo={logo}
                handleDrawerOpen={handleDrawerOpen}
              />
              <AppDrawer
                isMobile={isMobile}
                open={open}
                logo={logo}
                handleDrawerClose={handleDrawerClose}
                handleDrawerOpen={handleDrawerOpen}
                isSignedIn={isSignedIn}
                menus={menus}
              />

              <main className={classes.content}>
                  <div className={classes.toolbar} />
                  {healthCheckState.status === 'loading'
                    ? <Box display="flex" justifyContent="center" alignItems="center" className={classes.loading}>
                        <CircularProgress color='inherit' />
                    </Box>
                    : <Fade in>
                        <div>
                            <Switch>
                                <Route path="/" exact>{isSignedIn ? <Home /> : <Welcome />}</Route>
                                <Route path="/tweet-trap" exact>{isSignedIn ? <TweetTrap /> :
                                  <Redirect to="/" />}</Route>
                                <Route path="/tweet-trap/:id">{isSignedIn ? <TweetTrapSelected /> :
                                  <Redirect to="/" />}</Route>
                                <Route path="/terms"><Terms /></Route>
                                <Route path="/privacy"><Privacy /></Route>
                                <Route path="**"><NotFound /></Route>
                            </Switch>
                        </div>
                    </Fade>
                  }
              </main>
          </> : <ServerDown />}
      </div>
    )
}

function App() {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
    const theme = useMemo(
      () =>
        createMuiTheme({
            palette: {
                type: prefersDarkMode ? 'dark' : 'light',
                primary: {
                    main: lightBlue[600]
                },
            },
        }),
      [ prefersDarkMode ],
    )

    return (
      <ThemeProvider theme={theme}>
          <SnackbarProvider maxSnack={5}>
              <>
                  <CssBaseline />

                  <Router>
                      <AppWithProviders />
                  </Router>
              </>
          </SnackbarProvider>
      </ThemeProvider>
    )
}

export default App
