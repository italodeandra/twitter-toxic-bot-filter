import React, { useEffect, useMemo } from 'react'
import useTitle from '../../common/hooks/useTitle'
import { makeStyles } from '@material-ui/core/styles'
import { Box, Button, Fade, Typography } from '@material-ui/core'
import { PolicyRounded as PolicyRoundedIcon } from '@material-ui/icons'
import useHealthCheckApi from '../../api/healthCheck/useHealthCheckApi'
import { useCounter, useMountedState } from 'react-use'

const useStyles = makeStyles(() => ({
    root: {
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100%',
        width: '100%'
    },
    goku: {
        maxWidth: '100%'
    }
}))

const ServerDown = () => {
    useTitle('Server is down')
    const classes = useStyles()
    const [ , ping ] = useHealthCheckApi()
    const [ counter, { dec: decrease } ] = useCounter(30, undefined, 0)
    const isMounted = useMountedState()

    useEffect(() => {
        if (counter) {
            setTimeout(() => isMounted() && decrease(), 1000)
        } else {
            ping()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ counter ])

    const logo = useMemo(() => <PolicyRoundedIcon style={{ marginBottom: -7 }}
                                                  aria-label="twitter toxic-bot filter's logo" />, [])

    return (
      <Fade in>
          <Box p={3} display="flex" flexDirection="column" alignItems="center"
               justifyContent="center" className={classes.root}>
              <Typography variant="subtitle2" color="primary">
                  {logo} Twitter Toxic-bot Filter
              </Typography>
              <Box mt={3} mb={6}>
                  <Typography variant="overline" gutterBottom>Server is down. Trying again
                      in {counter} second{counter !== 1 ? 's' : ''}.</Typography>
              </Box>
              <img className={classes.goku} src={'/assets/goku-falling.gif'} alt="Goku falling gif" />
              <Box mt={6} mb={3}>
                  <Button variant="contained" disableElevation onClick={ping}>Try again</Button>
              </Box>
          </Box>
      </Fade>
    )
}

export default ServerDown