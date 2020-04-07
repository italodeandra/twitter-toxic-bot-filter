import React, { useMemo } from 'react'
import { createMuiTheme, makeStyles, Theme, ThemeProvider } from '@material-ui/core/styles'
import { BrowserRouter as Router, Link, Redirect, Route, Switch } from 'react-router-dom'
import Welcome from '../Welcome/Welcome'
import { lightBlue } from '@material-ui/core/colors'
import { CssBaseline, useMediaQuery } from '@material-ui/core'
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
import { SnackbarProvider } from 'notistack'
import TweetTrapSelected from '../TweetTrap/Selected/TweetTrapSelected'
import useSocket from '../../hooks/useSocket'
import NotFound from '../NotFound/NotFound'

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
        flexGrow: 1,
        // padding: theme.spacing(3),
    },
}))

const menus = [
    { title: 'Home', icon: <HomeRoundedIcon />, url: '/', exact: true },
    { title: 'Tweet trap', icon: <TrackChangesRoundedIcon />, url: '/tweet-trap' }
]

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

    const classes = useStyles()
    const isMobile = useMediaQuery(theme.breakpoints.down('xs'), { noSsr: true })
    const [ open, setOpen ] = useLocalStorage<boolean>('NavigationDrawerOpen', false)
    const [ user ] = useUser()
    const isSignedIn = !!user

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

    return (
      <div className={classes.root}>
          <ThemeProvider theme={theme}>
              <SnackbarProvider maxSnack={5}>
                  <>
                      <CssBaseline />

                      <Router>
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
                              <Switch>
                                  <Route path="/" exact>{isSignedIn ? <Home /> : <Welcome />}</Route>
                                  <Route path="/tweet-trap" exact>{isSignedIn ? <TweetTrap /> :
                                    <Redirect to="/" />}</Route>
                                  <Route path="/tweet-trap/:id">{isSignedIn ? <TweetTrapSelected /> :
                                    <Redirect to="/" />}</Route>
                                  <Route path="**"><NotFound /></Route>
                              </Switch>
                          </main>
                      </Router>
                  </>
              </SnackbarProvider>
          </ThemeProvider>
      </div>
    )
}

export default App
