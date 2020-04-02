import React, { FunctionComponent, ReactElement, useMemo } from 'react'
import { createMuiTheme, makeStyles, Theme, ThemeProvider } from '@material-ui/core/styles'
import MenuIcon from '@material-ui/icons/Menu'
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom'
import Welcome from './views/Welcome'
import { lightBlue } from '@material-ui/core/colors'
import {
    AppBar,
    Button,
    CssBaseline,
    Divider,
    Drawer,
    Hidden,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Tooltip,
    Typography,
    useMediaQuery,
    useScrollTrigger
} from '@material-ui/core'
import {
    Inbox as InboxIcon,
    Mail as MailIcon,
    MenuOpenRounded as MenuOpenRoundedIcon,
    PolicyRounded as PolicyRoundedIcon,
    Twitter as TwitterIcon
} from '@material-ui/icons'
import { useLocalStorage } from 'react-use'
import clsx from 'clsx'

const drawerWidth = 240

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: 'flex',
    },

    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        // boxShadow: theme.shadows[0],
        transition: theme.transitions.create([ 'width', 'margin', 'box-shadow' ], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create([ 'width', 'margin', 'box-shadow' ], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    appBarScrolled: {
        boxShadow: theme.shadows[4],
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: 'none',
    },
    logo: {
        display: 'flex',
        color: 'inherit',
        marginRight: theme.spacing(2),
    },
    flexGrow: {
        flexGrow: 1,
    },

    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        overflowY: 'hidden',
        width: theme.spacing(7) + 1,
        '&:hover': {
            overflowY: 'auto',
            [theme.breakpoints.up('sm')]: {
                width: theme.spacing(9) + 1,
            },
        }
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        [theme.breakpoints.down('xs')]: {
            justifyContent: 'flex-start',
        },
        padding: theme.spacing(0, 2),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar
    },
    drawerToolbarDivider: {
        marginTop: -1
    },

    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
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
        // className: trigger ? classes.appBarScrolled : undefined
    })
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

    const classes = useStyles()
    const isMobile = useMediaQuery(theme.breakpoints.down('xs'))
    const [ open, setOpen ] = useLocalStorage<boolean>('NavigationDrawerOpen', false)

    function handleDrawerOpen() {
        setOpen(true)
    }

    function handleDrawerClose() {
        setOpen(false)
    }

    const drawer = (<>
        <Divider className={classes.drawerToolbarDivider} />
        <List>
            {[ 'Inbox', 'Starred', 'Send email', 'Drafts' ].map((text, index) => (
              <Tooltip
                key={text}
                title={text}
                aria-label={text.toLowerCase()}
                placement="right"
                disableFocusListener={isMobile || open}
                disableHoverListener={isMobile || open}
                disableTouchListener={isMobile || open}
              >
                  <ListItem button>
                      <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                      <ListItemText primary={text} />
                  </ListItem>
              </Tooltip>
            ))}
        </List>
        <Divider />
        <List>
            {[ 'All mail', 'Trash', 'Spam' ].map((text, index) => (
              <Tooltip
                key={text}
                title={text}
                aria-label={text.toLowerCase()}
                placement="right"
                disableFocusListener={isMobile || open}
                disableHoverListener={isMobile || open}
                disableTouchListener={isMobile || open}
              >
                  <ListItem button>
                      <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                      <ListItemText primary={text} />
                  </ListItem>
              </Tooltip>
            ))}
        </List>
    </>)

    const logo = useMemo(() => (
      <Link to="/"
            className={classes.logo}
      >
          <PolicyRoundedIcon
            aria-label="twitter toxic-bot filter's logo"
          />
      </Link>
    ), [ classes ])

    return (
      <div className={classes.root}>
          <ThemeProvider theme={theme}>
              <CssBaseline />

              <Router>
                  <ElevationScroll>
                      <AppBar
                        position="fixed"
                        className={clsx(classes.appBar, {
                            [classes.appBarShift]: !isMobile && open,
                        })}
                      >
                          <Toolbar>
                              <IconButton
                                edge="start"
                                color="inherit"
                                aria-label="open drawer"
                                onClick={handleDrawerOpen}
                                className={clsx(classes.menuButton, {
                                    [classes.hide]: !isMobile && open,
                                })}
                              >
                                  <MenuIcon />
                              </IconButton>

                              {logo}

                              <Hidden xsDown={!(open)} smDown={open}>
                                  <Typography variant="h6" noWrap>
                                      Twitter Toxic-bot Filter
                                  </Typography>
                              </Hidden>

                              <div style={{ flexGrow: 1 }} />

                              <Button
                                color="inherit"
                                variant="outlined"
                                startIcon={<TwitterIcon />}
                                disableElevation
                              >
                                  Sign in
                              </Button>
                          </Toolbar>
                      </AppBar>
                  </ElevationScroll>
                  <nav aria-label="navigation menu">
                      <Hidden xsDown>
                          <Drawer
                            variant="permanent"
                            className={clsx(classes.drawer, {
                                [classes.drawerOpen]: open,
                                [classes.drawerClose]: !open,
                            })}
                            classes={{
                                paper: clsx({
                                    [classes.drawerOpen]: open,
                                    [classes.drawerClose]: !open,
                                }),
                            }}
                          >
                              <div className={classes.toolbar}>
                                  <IconButton onClick={handleDrawerClose}>
                                      <MenuOpenRoundedIcon />
                                  </IconButton>
                              </div>
                              {drawer}
                          </Drawer>
                      </Hidden>
                      <Hidden smUp>
                          <Drawer
                            variant="temporary"
                            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                            open={open}
                            onClose={handleDrawerClose}
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                            ModalProps={{
                                keepMounted: true, // Better open performance on mobile.
                            }}
                          >
                              <div className={classes.toolbar}>
                                  {logo}
                                  <Typography variant="subtitle2" noWrap>
                                      Twitter Toxic-bot Filter
                                  </Typography>
                              </div>
                              {drawer}
                          </Drawer>
                      </Hidden>
                  </nav>

                  <main className={classes.content}>
                      <div className={classes.toolbar} />
                      <Switch>
                          <Route path="/">
                              <Welcome />
                          </Route>
                      </Switch>
                  </main>
              </Router>
          </ThemeProvider>
      </div>
    )
}

export default App
