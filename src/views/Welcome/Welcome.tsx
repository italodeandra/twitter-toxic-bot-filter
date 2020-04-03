import React from 'react'
import { Button, Container, Theme, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { PolicyRounded as PolicyRoundedIcon, Twitter as TwitterIcon } from '@material-ui/icons'

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        [theme.breakpoints.up('sm')]: {
            padding: theme.spacing(8, 2),
        },
    },
    logo: {
        marginBottom: -7,
    },
    quote: {
        padding: theme.spacing(0, 3),
        maxWidth: theme.spacing(80)
    },
    biggerBottomGutter: {
        marginBottom: theme.spacing(5)
    }
}))

const Welcome: FunctionComponent = () => {
    const classes = useStyles()

    const Logo = <PolicyRoundedIcon className={classes.logo} aria-label="twitter toxic-bot filter's logo" />

    return (
      <Container maxWidth="md" className={classes.root}>
          <Typography variant="h4" gutterBottom>Welcome!</Typography>
          <Typography paragraph align="justify" className={classes.biggerBottomGutter}>
              This is the <strong>{Logo} Twitter Toxic-bot Filter</strong> app. It will help you filter out and mute
              all the Twitter users that are triggered by a
              specific subject and answers in an aggressive or unwanted way. Among other things.
          </Typography>
          <Typography variant="h5" gutterBottom>
              Origin
          </Typography>
          <Typography paragraph align="justify">
              I started developing it right after this was tweeted:
          </Typography>
          <Typography variant="body2" component='blockquote' paragraph className={classes.quote} align="justify">
              <span lang="en" dir="ltr">
                  At this point, I just wanted a tool that would allow me to post trigger words and block who
                  responds. In addition to clearing new profiles, @ with name and number with a lot of emoji and
                  some types of avatar.
              </span> &mdash; Translated from Atila Iamarino (@oatila)&nbsp;
              <a
                style={{ whiteSpace: 'nowrap' }}
                href="https://twitter.com/oatila/status/1243636812809109517"
                target="_blank"
                rel="noopener noreferrer"
              >March 27, 2020</a>
          </Typography>
          <Typography paragraph align="justify" className={classes.biggerBottomGutter}>
              Then I began this adventure to solve his problem. Of course there was some existing options, but none
              was doing exactly what he meant. I saw that opportunity and this happened. I hope you like it. <span
            role="img" aria-label="heart emoji">❤️</span>
          </Typography>

          <Typography variant="h5" gutterBottom>
              How to start?
          </Typography>
          <Typography paragraph align="justify">
              Start by signing in using you Twitter account by click on top right corner or right down below. Everything
              will be explained as you go. Have a nice journey.
          </Typography>
          <p>
              <Button
                variant="contained"
                color="primary"
                startIcon={<TwitterIcon />}
                disableElevation
              >
                  Sign in
              </Button>
          </p>
      </Container>
    )
}

export default Welcome