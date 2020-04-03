import React, { useState } from 'react'
import { Box, Button, Divider, ListItemIcon, ListSubheader, Menu, MenuItem, Theme, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { removeUser } from '../../../../store/reducers/user/userActions'
import { useUser } from '../../../../store/reducers/user/userReducer'
import { ExitToApp as ExitToAppIcon } from '@material-ui/icons'
import getInitials from '../../../../utils/getInitials'

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: 0,
        width: 36,
        minWidth: 36,
        height: 36,
        borderRadius: 18
    },
    signature: {
        fontFamily: '\'Montez\', cursive',
        fontSize: theme.typography.pxToRem(24),
        textDecoration: 'none',
        color: 'inherit'
    },
    madeBy: {
        fontSize: theme.typography.pxToRem(10),
        marginBottom: 4
    }
}))

const UserMenu = () => {
    const classes = useStyles()
    const [ anchorEl, setAnchorEl ] = useState<HTMLElement | null>(null)
    const [ user, userDispatch ] = useUser()

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    function handleSignOutClick() {
        userDispatch(removeUser())
    }

    return (<>
        <Button
          aria-label="user menu button"
          className={classes.root}
          variant="contained"
          disableElevation
          color="primary"
          aria-controls="user-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
            {getInitials(user!.fullName)}
        </Button>
        <Menu
          id="user-menu"
          anchorEl={anchorEl}
          anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
          }}
          getContentAnchorEl={null}
          // keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
            <ListSubheader component="div">
                Ítalo Andrade
            </ListSubheader>
            <MenuItem onClick={handleSignOutClick}>
                <ListItemIcon>
                    <ExitToAppIcon fontSize="small" />
                </ListItemIcon>
                <Typography variant="inherit">Sign out</Typography>
            </MenuItem>
            <Box mt={2}>
                <Divider />
            </Box>
            <Box m={2} mt={3} display="flex" alignItems="center" flexDirection="column">
                <Typography variant="overline" className={classes.madeBy}>
                    Made with love and javascript by
                </Typography>
                <a href="https://italodeandra.de" target="_blank" rel="noopener noreferrer"
                   className={classes.signature}>
                    {/*<Image
                    src="/signature.png"
                    color="transparent"
                    style={{ height: 150, width: 500, paddingTop: undefined }}
                  />*/}
                    Ítalo Andrade
                </a>
                <Typography variant="overline">© 2020</Typography>
            </Box>
        </Menu>
    </>)
}

export default UserMenu