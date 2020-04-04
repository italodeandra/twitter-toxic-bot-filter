import React, { FunctionComponent, ReactElement, ReactNode } from 'react'
import clsx from 'clsx'
import { AppBar, Button, Hidden, Toolbar, Typography, useScrollTrigger } from '@material-ui/core'
import { Twitter as TwitterIcon } from '@material-ui/icons'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { drawerWidth } from '../App'
import MenuButton from '../MenuButton/MenuButton'
import { useUser } from '../../../store/reducers/user/userReducer'
import { updateUser } from '../../../store/reducers/user/userActions'
import UserMenu from './UserMenu/UserMenu'

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
    const classes = useStyles()
    const [ user, userDispatch ] = useUser()
    const isSignedIn = !!user

    function handleSignInClick() {
        userDispatch(updateUser({
            id: 1,
            fullName: 'Ítalo Andrade'
        }))
    }

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

                  <Hidden xsDown={!(open)} smDown={open}>
                      <Typography variant="h6" noWrap className={classes.title}>
                          Twitter Toxic-bot Filter
                      </Typography>
                  </Hidden>

                  <div style={{ flexGrow: 1 }} />

                  <div>
                      {isSignedIn
                        ? (
                          <UserMenu />
                        ) : (
                          <Button
                            id="sign-in-button"
                            color="inherit"
                            variant="outlined"
                            startIcon={<TwitterIcon />}
                            disableElevation
                            onClick={handleSignInClick}
                          >
                              Sign in
                          </Button>
                        )
                      }
                  </div>
              </Toolbar>
          </AppBar>
      </ElevationScroll>
    )
}

export default AppAppBar