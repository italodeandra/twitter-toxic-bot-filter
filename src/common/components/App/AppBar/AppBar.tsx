import React, { FunctionComponent, ReactElement, ReactNode } from 'react'
import clsx from 'clsx'
import { AppBar as MuiAppBar, Toolbar, Typography, useMediaQuery, useScrollTrigger, } from '@material-ui/core'
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles'
import { drawerWidth } from '../../../../views/App/App'
import MenuButton from '../MenuButton/MenuButton'
import useTitle from '../../../../hooks/useTitle'

const useStyles = makeStyles((theme: Theme) => ({
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        // boxShadow: theme.shadows[0],
        transition: theme.transitions.create([ 'width', 'margin', 'box-shadow', 'background-color' ], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        color: theme.palette.type === 'light' ? theme.palette.primary.main : theme.palette.primary.contrastText,
        backgroundColor: theme.palette.type === 'light' ? theme.palette.primary.contrastText : theme.palette.primary.main,
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
    open: boolean
    logo: ReactNode
    handleDrawerOpen?: () => void
    appTitle: string
    drawerShowing: boolean
}

const AppBar: FunctionComponent<Props> = ({
                                              children,
                                              open,
                                              logo,
                                              handleDrawerOpen,
                                              appTitle,
                                              drawerShowing
                                          }) => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('xs'), { noSsr: true })
    const classes = useStyles()
    const [ title ] = useTitle()

    return (
      <ElevationScroll>
          <MuiAppBar
            position="fixed"
            className={clsx(classes.appBar, {
                [classes.appBarShift]: drawerShowing && !isMobile && open,
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
                    show={drawerShowing}
                  />

                  {logo}

                  {(title !== appTitle || !isMobile) &&
                  <Typography variant="h6" noWrap className={classes.title}>
                      {title}
                  </Typography>
                  }

                  {children}
              </Toolbar>
          </MuiAppBar>
      </ElevationScroll>
    )
}

export default AppBar