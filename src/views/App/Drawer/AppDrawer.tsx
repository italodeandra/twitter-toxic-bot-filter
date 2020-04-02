import {
    Divider,
    Drawer,
    Hidden,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Tooltip,
    Typography,
    useTheme
} from '@material-ui/core'
import React, { FunctionComponent, ReactNode, useState } from 'react'
import useScrollVisible from '../../../hooks/useScrollVisible'
import { Inbox as InboxIcon, Mail as MailIcon } from '@material-ui/icons'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { drawerWidth } from '../App'
import clsx from 'clsx'
import MenuButton from '../MenuButton/MenuButton'

export const toolbarStyles = (theme: Theme) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    [theme.breakpoints.down('xs')]: {
        justifyContent: 'flex-start',
    },
    padding: theme.spacing(0, 2),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar
})

const useStyles = makeStyles((theme: Theme) => ({
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
        overflowX: 'hidden',
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        overflowY: 'hidden',
        width: theme.spacing(7) + 1,
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
        marginTop: -1
    },

    toolbar: {
        ...toolbarStyles(theme)
    }
}))

interface Props {
    isMobile: boolean
    open: boolean
    logo: ReactNode
    handleDrawerClose: () => void
}

const AppDrawer: FunctionComponent<Props> = ({
                                                 isMobile,
                                                 open,
                                                 logo,
                                                 handleDrawerClose,
                                             }) => {
    const classes = useStyles()
    const theme = useTheme()

    const [ scrollableElementRef, setScrollableElementRef ] = useState<HTMLElement>()
    const [ isDrawerCloseScrollVisible ] = useScrollVisible(scrollableElementRef)

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

    return (
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
                        [classes.drawerCloseScrollable]: isDrawerCloseScrollVisible
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
                      />
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
              </Drawer>
          </Hidden>
      </nav>
    )
}

export default AppDrawer