import {
    Avatar,
    Box,
    Breadcrumbs,
    Button,
    Card,
    Checkbox,
    Chip,
    CircularProgress,
    Container,
    Divider,
    Fade,
    Hidden,
    IconButton,
    LinearProgress,
    Link,
    List,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
    ListSubheader,
    TextField,
    Theme,
    Tooltip,
    Typography
} from '@material-ui/core'
import React, { useEffect, useRef, useState } from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import useTweetTrapApi from '../../../api/tweetTrap/useTweetTrapApi'
import { useSnackbar } from 'notistack'
import { Link as RouterLink, useHistory, useRouteMatch } from 'react-router-dom'
import TweetTrapListSkeleton from '../TweetTrapListSkeleton'
import { default as ETweetTrap } from '../../../api/tweetTrap/TweetTrap'
import useSocket from '../../../hooks/useSocket'
import { animated, useTransition } from 'react-spring'
import {
    PolicyRounded as PolicyRoundedIcon,
    SyncProblemRounded as SyncProblemRoundedIcon,
    SyncRounded as SyncRoundedIcon
} from '@material-ui/icons'
import moment from 'moment'
import useBotScoreApi from '../../../api/botScore/useBotScoreApi'
import BotScore from '../../../api/botScore/BotScore'
import TweetTrapSelectedMuteByBotScoreDialog
    from './MuteDialogs/MuteByBotScoreDialog/TweetTrapSelectedMuteByBotScoreDialog'
import TweetTrapSelectedMuteConfirmDialog from './MuteDialogs/MuteConfirmDialog/TweetTrapSelectedMuteConfirmDialog'
import { useDeepCompareEffect } from 'react-use'
import useTitle from '../../../common/hooks/useTitle'

const BIGINT_MAX = 9223372036854775807

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        width: '100%',
        maxWidth: '36ch',
        backgroundColor: theme.palette.background.paper,
    },
    inline: {
        display: 'inline',
    },
    linearLoading: {
        position: 'fixed',
        left: 0,
        right: 0,
        height: 3,
        zIndex: theme.zIndex.appBar + 1,
    },
    buttonSpacing: {
        '& + &': {
            marginLeft: theme.spacing(1)
        }
    }
}))

const TweetTrapSelected = () => {
    useTitle('Tweet trap')
    const theme = useTheme()
    const classes = useStyles()
    const [ tweetTrapState, { get: getTweetTrap } ] = useTweetTrapApi({ status: 'loading' })
    const [ tweetTrapRepliesState, { getReplies: getTweetTrapReplies, manualUpdateData: manualUpdateTweetTrapReplies } ] = useTweetTrapApi({ status: 'loading' })
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()
    const route = useRouteMatch<{ id: string }>()
    const history = useHistory()
    const [ selectedNames, setSelectedNames ] = useState<string[]>([])
    const socket = useSocket()
    const [ autoSync, setAutoSync ] = useState(false)
    const [ botScoreState, { get: getBotScores } ] = useBotScoreApi()

    const tweetTrapRepliesDataRef = useRef(tweetTrapRepliesState.status === 'success' ? tweetTrapRepliesState.data : [])
    useDeepCompareEffect(() => {
        tweetTrapRepliesDataRef.current = tweetTrapRepliesState.status === 'success' ? tweetTrapRepliesState.data : []
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ tweetTrapRepliesState ])

    const transitions = useTransition(tweetTrapRepliesState.status === 'success' ? tweetTrapRepliesState.data : [], item => item.id, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
    })

    useEffect(() => {
        const { id } = route.params
        if (+id > BIGINT_MAX) {
            enqueueSnackbar('Tweet not found')
            history.push('/tweet-trap')
            return
        }

        getTweetTrap(id)
        getTweetTrapReplies(id)

        function handleNewTweetTrapReply(newTweetTrap: ETweetTrap) {
            manualUpdateTweetTrapReplies([
                newTweetTrap,
                ...tweetTrapRepliesDataRef.current
            ])
        }

        socket.emit('subscribeTweetTrapReplies', id)

        socket.on('newTweetTrapReply', handleNewTweetTrapReply)
        socket.on('tweetTrapReplyAutoSync', setAutoSync)

        return () => {
            socket.emit('unsubscribeTweetTrapReplies')
            socket.off('newTweetTrapReply', handleNewTweetTrapReply)
            socket.off('tweetTrapReplyAutoSync', setAutoSync)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        let error = false
        let notFound = false

        if (tweetTrapState.status === 'error') {
            if (tweetTrapState.error && tweetTrapState.error.statusCode === 404) {
                notFound = true
            } else {
                error = tweetTrapState.error.message
            }
        }

        if (tweetTrapRepliesState.status === 'error') {
            console.log(tweetTrapRepliesState.error)
            if (tweetTrapRepliesState.error && tweetTrapRepliesState.error.statusCode === 404) {
                notFound = true
            } else {
                error = tweetTrapRepliesState.error.message
            }
        }

        if (notFound) {
            enqueueSnackbar('Tweet not found')
            history.push('/tweet-trap')
        } else if (error) {
            enqueueSnackbar(error, {
                variant: 'error',
                persist: true,
                action: key => (
                  <Button onClick={() => closeSnackbar(key)} color="inherit">
                      Okay
                  </Button>
                )
            })
            console.error(tweetTrapState, tweetTrapRepliesState)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ tweetTrapState.status, tweetTrapRepliesState.status ])

    useEffect(() => {
        if (botScoreState.status === 'success') {
            const botScores: BotScore[] = botScoreState.data
            for (let botScore of botScores) {
                const updatedTweetTrapReplies: ETweetTrap[] = [ ...tweetTrapRepliesDataRef.current ]

                for (let tweetTrap of updatedTweetTrapReplies) {
                    if (tweetTrap.createdBy!.screenName! === botScore.name) {
                        tweetTrap.botScore = botScore.score
                    }
                }

                manualUpdateTweetTrapReplies(updatedTweetTrapReplies)
            }
        } else if (botScoreState.status === 'error') {
            enqueueSnackbar('There was an error while trying to fetch the bot scores. Please, try again later.', {
                variant: 'error',
                persist: true,
                action: key => (
                  <Button onClick={() => closeSnackbar(key)} color="inherit">
                      Okay
                  </Button>
                )
            })
            console.error(botScoreState)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ botScoreState.status ])

    function handleTweetClick(t: ETweetTrap) {
        let updatedSelectedNames = [ ...selectedNames ]
        const tweetFound = selectedNames.findIndex((name: string) => name === t.createdBy!.screenName!)
        if (tweetFound > -1) {
            updatedSelectedNames.splice(tweetFound, 1)
        } else {
            updatedSelectedNames.push(t.createdBy!.screenName!)
        }
        setSelectedNames(updatedSelectedNames)
    }

    function handleSyncClick() {
        getTweetTrapReplies(route.params.id)
    }

    function getNames(): string[] {
        let names: string[] = []

        if (selectedNames.length) {
            names = selectedNames
        } else {
            if (tweetTrapRepliesState.status === 'success') {
                for (let tweetTrap of tweetTrapRepliesState.data as ETweetTrap[]) {
                    if (!names.includes(tweetTrap.createdBy!.screenName!)) {
                        names.push(tweetTrap.createdBy!.screenName!)
                    }
                }
            }
        }

        return names
    }

    function handleScanBotScoreClick() {
        const names = getNames()
        if (names.length) {
            getBotScores(getNames())

            enqueueSnackbar('The scan for the bot score started. It might take some time depending on the amount of profiles being scanned.', {
                autoHideDuration: 10000
            })
        } else {
            enqueueSnackbar('There is none to be scanned')
        }
    }

    function retryGetReplies() {
        const { id } = route.params
        getTweetTrapReplies(id)
    }

    return (<>
        {[ tweetTrapState.status, botScoreState.status ].includes('loading') &&
        <LinearProgress className={classes.linearLoading} />
        }
        <Container maxWidth="md" disableGutters><Box p={3}>
            <Box mb={3}>
                <Breadcrumbs separator="›" aria-label="breadcrumb">
                    <Link color="inherit" to="/tweet-trap" component={RouterLink}>
                        Tweet trap
                    </Link>
                    <Typography color="textPrimary">Selected</Typography>
                </Breadcrumbs>
            </Box>
            <Box>
                <Typography paragraph variant="subtitle2">
                    You've tweeted and here will show everyone who replied that wasn't muted yet
                </Typography>
                <TextField
                  label="Message sent"
                  variant="filled"
                  fullWidth
                  multiline
                  rowsMax={40}
                  value={tweetTrapState.status === 'success' ? tweetTrapState.data.text : ''}
                  InputProps={{
                      readOnly: true,
                      disableUnderline: true
                  }}
                />
            </Box>

            <Box my={2} display="flex" alignItems="center">
                <TweetTrapSelectedMuteConfirmDialog
                  selectedNames={selectedNames}
                  classes={classes}
                  tweetTrapRepliesState={tweetTrapRepliesState}
                  tweetTrapState={tweetTrapState}
                  getNames={getNames}
                  getTweetTrapReplies={getTweetTrapReplies.bind(null, route.params.id)}
                />
                <Button
                  variant="contained"
                  disableElevation
                  color="primary"
                  type="submit"
                  disabled={tweetTrapState.status !== 'success' || tweetTrapRepliesState.status !== 'success' || botScoreState.status === 'loading'}
                  className={classes.buttonSpacing}
                  onClick={handleScanBotScoreClick}
                >Scan {selectedNames.length || 'all'} bot score</Button>
                <TweetTrapSelectedMuteByBotScoreDialog
                  botScoreState={botScoreState}
                  selectedNames={selectedNames}
                  classes={classes}
                  tweetTrapRepliesState={tweetTrapRepliesState}
                  getTweetTrapReplies={getTweetTrapReplies.bind(null, route.params.id)}
                />

                <Hidden smDown>
                    {[ botScoreState.status ].includes('loading') &&
                    <Fade in timeout={{ enter: 1000 }}>
                        <CircularProgress size={theme.spacing(3)} style={{ marginLeft: theme.spacing(2) }} />
                    </Fade>
                    }
                </Hidden>
            </Box>

            <Box>
                <Card>
                    <List
                      subheader={
                          <ListSubheader component="div">
                              <Box display="flex">
                                  Tweet trap replies

                                  {tweetTrapRepliesState.status === 'success' &&
                                  <Box ml='auto'>
                                      <Tooltip
                                        title={autoSync
                                          ? 'Realtime sync is on. Click here to force a manually sync.'
                                          : 'Realtime sync was blocked by Twitter. Click here to manually sync.'
                                        }
                                      >
                                          <IconButton size="small" onClick={handleSyncClick}>
                                              {autoSync
                                                ? <SyncRoundedIcon />
                                                : <SyncProblemRoundedIcon />
                                              }
                                          </IconButton>
                                      </Tooltip>
                                  </Box>
                                  }
                              </Box>
                          </ListSubheader>
                      }
                    >
                        {tweetTrapRepliesState.status === 'loading'
                          ? <TweetTrapListSkeleton />
                          : <>
                              {transitions.map(({ item: t, props, key }: { item: ETweetTrap, props: any, key: any }, i: number) =>
                                <animated.div key={key} style={props}>
                                    {i > 0 &&
                                    <Divider variant="inset" component="li" />
                                    }
                                    <ListItem alignItems="flex-start" button
                                              onClick={handleTweetClick.bind(null, t)}>
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
                                                  {t.botScore &&
                                                  <Tooltip
                                                    title={`${t.createdBy!.name} has ${Math.round(t.botScore)}% chance of being a bot`}
                                                  >
                                                      <Chip
                                                        avatar={<PolicyRoundedIcon />}
                                                        size="small"
                                                        label={`${Math.round(t.botScore)}%`}
                                                        style={{ margin: theme.spacing(0, 1) }}
                                                      />
                                                  </Tooltip>
                                                  }
                                              </Typography>
                                              <Typography
                                                component="span"
                                                variant="caption"
                                                className={classes.inline}
                                                color="textPrimary"
                                              >
                                                  {` @${t.createdBy?.screenName} `}
                                                  <span
                                                    style={{ opacity: 0.8 }}
                                                    title={moment(t.createdAt).format('LLLL')}
                                                  >
                                                          {moment(t.createdAt).fromNow()}
                                                      </span>
                                              </Typography>
                                          </>}
                                          secondary={t.text}
                                        />
                                        <ListItemSecondaryAction>
                                            {/*<Box display="flex" alignItems="center">*/}
                                            <Checkbox
                                              edge="end"
                                              checked={selectedNames.includes(t.createdBy!.screenName!)}
                                              onClick={handleTweetClick.bind(null, t)}
                                              color="primary"
                                              // onChange={handleToggle(value)}
                                              // checked={checked.indexOf(value) !== -1}
                                            />
                                            {/*</Box>*/}
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                </animated.div>
                              )}
                          </>
                        }
                        {tweetTrapRepliesState.status === 'success' && !tweetTrapRepliesState.data.length &&
                        <Box m={2} style={{ opacity: 0.6 }}>You have no new replies</Box>
                        }
                        {tweetTrapRepliesState.status === 'error' && <>
                            <Box m={2} style={{ opacity: 0.6 }}>
                                {tweetTrapRepliesState.error.message}
                                <Button
                                  style={{ marginLeft: theme.spacing(1) }}
                                  size="small"
                                  onClick={retryGetReplies}
                                >Try again</Button>
                            </Box>
                        </>}
                    </List>
                </Card>
            </Box>
            <Box mt={2}>
                <Typography variant="caption">Note: We show here all the replies. So you might see the same profile
                    more than once. Checking one will check all the other ones.</Typography>
            </Box>
        </Box></Container>
    </>)
}

export default TweetTrapSelected