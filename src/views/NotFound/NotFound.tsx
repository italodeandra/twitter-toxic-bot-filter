import React from 'react'
import useTitle from '../../hooks/useTitle'
import johnTravolta from './john-travolta.gif'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() => ({
    john: {
        position: 'fixed',
        bottom: 0,
        right: 0,
        maxWidth: '100%'
    }
}))

const NotFound = () => {
    useTitle('Page not found')
    const classes = useStyles()

    return (
      <img className={classes.john} src={johnTravolta} alt="John Travolta's confused gif" />
    )
}

export default NotFound