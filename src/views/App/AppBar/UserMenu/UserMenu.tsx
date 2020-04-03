import React, { useState } from 'react'
import { Button, ListItemIcon, ListSubheader, Menu, MenuItem, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { removeUser } from '../../../../store/reducers/user/userActions'
import { useUser } from '../../../../store/reducers/user/userReducer'
import { ExitToApp as ExitToAppIcon } from '@material-ui/icons'
import getInitials from '../../../../utils/getInitials'

const useStyles = makeStyles(() => ({
    root: {
        padding: 0,
        width: 36,
        minWidth: 36,
        height: 36,
        borderRadius: 18
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
        </Menu>
    </>)
}

export default UserMenu