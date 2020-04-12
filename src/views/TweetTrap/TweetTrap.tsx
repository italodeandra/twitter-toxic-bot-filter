import {
    Avatar,
    Box,
    Button,
    Card,
    CircularProgress,
    Container,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListSubheader,
    Typography,
    useMediaQuery
} from '@material-ui/core'
import React, { useEffect } from 'react'
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles'
import useTweetTrapApi from '../../api/tweetTrap/useTweetTrapApi'
import { useSnackbar } from 'notistack'
import { Link, useHistory } from 'react-router-dom'
import TweetTrapListSkeleton from './TweetTrapListSkeleton'
import { useMount } from 'react-use'
import { default as ETweetTrap } from '../../api/tweetTrap/TweetTrap'
import moment from 'moment'
import useTitle from '../../hooks/useTitle'

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        width: '100%',
        maxWidth: '36ch',
        backgroundColor: theme.palette.background.paper,
    },
    inline: {
        display: 'inline',
    }
}))

const TweetTrap = () => {
    useTitle('Tweet trap')
    const classes = useStyles()
    const theme = useTheme()
    const [ tweetText, setTweetText ] = useState('')
    const [ tweetTheTweetTrapState, { tweet: tweetTheTweetTrap } ] = useTweetTrapApi()
    const [ lastTweetTrapsState, { list: listLastTweetTraps } ] = useTweetTrapApi({ status: 'loading' })
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()
    const history = useHistory()
    const isMobile = useMediaQuery(theme.breakpoints.down('xs'), { noSsr: true })

    useMount(() => {
        listLastTweetTraps()
    })

    function handleTweetTextChange(event: ChangeEvent<HTMLTextAreaElement>) {
        setTweetText(event.target.value)
    }

    function handleTweetSubmit(event: FormEvent) {
        event.preventDefault()

        tweetTheTweetTrap({
            text: tweetText
        })
    }

    useEffect(() => {
        if (tweetTheTweetTrapState.status === 'success') {
            history.push(`/tweet-trap/${tweetTheTweetTrapState.data.id}`)
        } else if (tweetTheTweetTrapState.status === 'error') {
            if (tweetTheTweetTrapState.error.statusCode === 409) {
                enqueueSnackbar(tweetTheTweetTrapState.error.message, {
                    variant: 'error',
                    persist: true,
                    action: key => (
                      <Button onClick={() => closeSnackbar(key)} color="inherit">
                          Okay
                      </Button>
                    )
                })
            } else {
                enqueueSnackbar('There was an error while trying to tweet. Please, try again later.', {
                    variant: 'error',
                    persist: true,
                    action: key => (
                      <Button onClick={() => closeSnackbar(key)} color="inherit">
                          Okay
                      </Button>
                    )
                })
                console.error(tweetTheTweetTrapState)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ tweetTheTweetTrapState.status ])

    return (
      <Container maxWidth="md" disableGutters><Box p={3}>
          <Box>
              <Typography paragraph variant="subtitle2">
                  Tweet something that will trigger the toxic bots (or even some unwanted toxic followers)
              </Typography>
              <form onSubmit={handleTweetSubmit}>
                  <TextField
                    label="Message"
                    variant="filled"
                    fullWidth
                    multiline
                    rowsMax={40}
                    onChange={handleTweetTextChange}
                    value={tweetText}
                    error={tweetText.length > 280}
                    helperText={tweetText.length > 280 ? tweetText.length + '/280' : undefined}
                    disabled={tweetTheTweetTrapState.status === 'loading'}
                  />
                  <Box my={2} display="flex" alignItems="center">
                      <Button
                        variant="contained"
                        disableElevation
                        color="primary"
                        type="submit"
                        disabled={tweetText.length > 280 || tweetTheTweetTrapState.status === 'loading'}
                        size={isMobile ? 'large' : undefined}
                        fullWidth={isMobile}
                      >Tweet</Button>

                      {tweetTheTweetTrapState.status === 'loading' &&
                      <CircularProgress size={theme.spacing(3)} style={{ marginLeft: theme.spacing(2) }} />
                      }
                  </Box>
              </form>
          </Box>

          <Box>
              <Card>
                  <List
                    subheader={
                        <ListSubheader component="div">
                            Recent tweet traps
                        </ListSubheader>
                    }
                  >
                      {lastTweetTrapsState.status === 'loading'
                        ? <TweetTrapListSkeleton />
                        : <>
                            {lastTweetTrapsState.status === 'success' && lastTweetTrapsState.data.map((t: ETweetTrap, i: number) => (
                              <div key={t.id}>
                                  {i > 0 &&
                                  <Divider variant="inset" component="li" />
                                  }
                                  <ListItem alignItems="flex-start" button component={Link} to={`/tweet-trap/${t.id}`}>
                                      <ListItemAvatar>
                                          <Avatar alt="Remy Sharp" src={t.createdBy?.profileImageUrl} />
                                      </ListItemAvatar>
                                      <ListItemText
                                        primary={<>
                                            <Typography
                                              component="span"
                                              variant="subtitle2"
                                              className={classes.inline}
                                              color="textPrimary"
                                            >
                                                {t.createdBy?.name}
                                            </Typography>
                                            <Typography
                                              component="span"
                                              variant="caption"
                                              className={classes.inline}
                                              color="textPrimary"
                                            >
                                                {` @${t.createdBy?.screenName} `}
                                                <span style={{ opacity: 0.8 }}
                                                      title={moment(t.createdAt).format('LLLL')}>{moment(t.createdAt).fromNow()}</span>
                                            </Typography>
                                        </>}
                                        secondary={t.text}
                                      />
                                  </ListItem>
                              </div>))}
                        </>
                      }
                      {lastTweetTrapsState.status === 'success' && !lastTweetTrapsState.data.length &&
                      <Box m={2} style={{ opacity: 0.6 }}>You have no tweet traps</Box>
                      }
                  </List>
              </Card>
          </Box>
      </Box></Container>
    )
}

export default TweetTrap