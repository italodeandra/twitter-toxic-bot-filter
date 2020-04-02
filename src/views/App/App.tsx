import React, { useMemo } from 'react'
import { createMuiTheme, makeStyles, Theme, ThemeProvider } from '@material-ui/core/styles'
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom'
import Welcome from '../Welcome/Welcome'
import { lightBlue } from '@material-ui/core/colors'
import { CssBaseline, useMediaQuery } from '@material-ui/core'
import { PolicyRounded as PolicyRoundedIcon } from '@material-ui/icons'
import { useLocalStorage } from 'react-use'
import AppDrawer, { toolbarStyles } from './Drawer/AppDrawer'
import AppAppBar from './AppBar/AppBar'

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
        padding: theme.spacing(3),
    },
}))

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
    const isMobile = useMediaQuery(theme.breakpoints.down('xs'))
    const [ open, setOpen ] = useLocalStorage<boolean>('NavigationDrawerOpen', false)

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
                  />

                  <main className={classes.content}>
                      <div className={classes.toolbar} />
                      <Switch>
                          <Route path="/"><Welcome /></Route>
                      </Switch>
                  </main>
              </Router>
          </ThemeProvider>
      </div>
    )
}

export default App
