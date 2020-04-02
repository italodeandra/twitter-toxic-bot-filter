import React, { FunctionComponent, ReactElement, ReactNode } from 'react'
import clsx from 'clsx'
import { AppBar, Button, Hidden, Toolbar, Typography, useScrollTrigger } from '@material-ui/core'
import { Twitter as TwitterIcon } from '@material-ui/icons'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { drawerWidth } from '../App'
import MenuButton from '../MenuButton/MenuButton'

const useStyles = makeStyles((theme: Theme) => ({
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

    return (
      <ElevationScroll>
          <AppBar
            position="fixed"
            className={clsx(classes.appBar, {
                [classes.appBarShift]: !isMobile && open,
            })}
          >
              <Toolbar>
                  <MenuButton
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    className={classes.menuButton}
                    isMobile={isMobile}
                    open={open}
                    onClick={handleDrawerOpen}
                    location="app-bar"
                  />

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
    )
}

export default AppAppBar