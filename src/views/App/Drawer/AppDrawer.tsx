import {
    Divider,
    Drawer,
    Hidden,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    SwipeableDrawer,
    Tooltip,
    Typography,
} from '@material-ui/core'
import React, { FunctionComponent, ReactElement, ReactNode, useState } from 'react'
import useScrollVisible from '../../../hooks/useScrollVisible'
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles'
import { drawerWidth } from '../App'
import clsx from 'clsx'
import MenuButton from '../MenuButton/MenuButton'
import { NavLink } from 'react-router-dom'

export const toolbarStyles = (theme: Theme) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 2),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    minHeight: '48px !important',
    [theme.breakpoints.down('xs')]: {
        justifyContent: 'flex-start',
        minHeight: '56px !important'
    },
    color: theme.palette.primary.main
})

const useStyles = makeStyles((theme: Theme) => ({
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerPaper: {
        width: drawerWidth,
        // backgroundColor: 'transparent',
        // border: 'none'
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create([ 'width', 'border', 'background-color' ], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        overflowX: 'hidden',
    },
    drawerClose: {
        transition: theme.transitions.create([ 'width', 'border', 'background-color' ], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        overflowY: 'hidden',
        width: theme.spacing(7) + 1,
        border: 'none',
        backgroundColor: 'transparent',
    },
    drawerCloseScrollable: {
        '&:hover': {
            overflowY: 'auto',
            [theme.breakpoints.up('sm')]: {
                width: theme.spacing(9) + 1,
            },
        }
    },
    drawerToolbarDivider: {
        marginBottom: -1
    },
    drawerSignedOut: {
        width: '0 !important'
    },
    menu: {
        transition: theme.transitions.create([ 'backgroundColor', 'color', 'fontWeight' ], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.short,
        }),

        '&.active': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            fontWeight: theme.typography.fontWeightMedium,
        }
    },
    menuIcon: {
        color: 'inherit'
    },

    toolbar: {
        ...toolbarStyles(theme),
        // borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
        // paddingRight: 0
    },
}))

interface Props {
    isMobile: boolean
    open: boolean
    logo: ReactNode
    handleDrawerClose: () => void
    handleDrawerOpen: () => void
    isSignedIn: boolean
    menus: {
        title: string
        icon: ReactElement
        url: string
        exact?: boolean
    }[]
}

const AppDrawer: FunctionComponent<Props> = ({
                                                 isMobile,
                                                 open,
                                                 logo,
                                                 handleDrawerClose,
                                                 handleDrawerOpen,
                                                 isSignedIn,
                                                 menus
                                             }) => {
    const classes = useStyles()
    const theme = useTheme()

    const [ scrollableElementRef, setScrollableElementRef ] = useState<HTMLElement>()
    const [ isDrawerCloseScrollVisible ] = useScrollVisible(scrollableElementRef)

    const drawer = (<>
        {open &&
        <Divider className={classes.drawerToolbarDivider} />
        }
        <List dense={!isMobile}>
            {menus.map(menu => (
              <Tooltip
                key={menu.title}
                title={menu.title}
                aria-label={menu.title.toLowerCase()}
                placement="right"
                disableFocusListener={isMobile || open}
                disableHoverListener={isMobile || open}
                disableTouchListener={isMobile || open}
              >
                  <ListItem
                    button
                    component={NavLink}
                    to={menu.url}
                    className={classes.menu}
                    exact={menu.exact}
                    onClick={isMobile ? handleDrawerClose : undefined}
                  >
                      <ListItemIcon className={classes.menuIcon}>{menu.icon}</ListItemIcon>
                      <ListItemText primary={menu.title} primaryTypographyProps={{ variant: 'inherit' }} />
                  </ListItem>
              </Tooltip>
            ))}
        </List>
    </>)

    return (
      <nav aria-label="navigation menu">
          <Hidden xsDown>
              <Drawer
                variant="permanent"
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                    [classes.drawerSignedOut]: !isSignedIn
                })}
                classes={{
                    paper: clsx(classes.drawerPaper, {
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                        [classes.drawerSignedOut]: !isSignedIn,
                        [classes.drawerCloseScrollable]: isDrawerCloseScrollVisible,
                    }),
                }}
                ModalProps={{
                    keepMounted: true,
                }}
                PaperProps={{
                    ref: (ref: HTMLElement) => setScrollableElementRef(ref)
                }}
              >
                  <div className={classes.toolbar}>
                      <MenuButton
                        isMobile={isMobile}
                        open={open}
                        onClick={handleDrawerClose}
                        location="drawer"
                        isSignedIn={isSignedIn}
                      />
                  </div>
                  {drawer}
              </Drawer>
          </Hidden>
          <Hidden smUp>
              <SwipeableDrawer
                variant="temporary"
                anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                open={open}
                onClose={handleDrawerClose}
                onOpen={handleDrawerOpen}
                classes={{
                    paper: classes.drawerPaper,
                }}
                ModalProps={{
                    keepMounted: true,
                }}
              >
                  <div className={classes.toolbar}>
                      {logo}
                      <Typography variant="subtitle2" noWrap>
                          Twitter Toxic-bot Filter
                      </Typography>
                  </div>
                  {drawer}
              </SwipeableDrawer>
          </Hidden>
      </nav>
    )
}

export default AppDrawer