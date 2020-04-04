import {
    Box,
    Button,
    CircularProgress,
    Container,
    TextareaAutosize,
    TextField,
    Theme,
    Typography,
    useTheme,
    withStyles
} from '@material-ui/core'
import React, { ChangeEvent, useEffect, useMemo, useState } from 'react'
import { useUser } from '../../store/reducers/user/userReducer'
import moment from 'moment'
import { IconContainerProps, Rating } from '@material-ui/lab'
import {
    SendRounded as SendRoundedIcon,
    SentimentDissatisfied as SentimentDissatisfiedIcon,
    SentimentSatisfied as SentimentSatisfiedIcon,
    SentimentSatisfiedAlt as SentimentSatisfiedAltIcon,
    SentimentVeryDissatisfied as SentimentVeryDissatisfiedIcon,
    SentimentVerySatisfied as SentimentVerySatisfiedIcon,
    TrackChangesRounded as TrackChangesRoundedIcon
} from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'
import { useMount } from 'react-use'
import useFeedbackApi from '../../api/feedback/useFeedbackApi'

const customIcons: { [index: string]: { icon: React.ReactElement; label: string } } = {
    1: {
        icon: <SentimentVeryDissatisfiedIcon />,
        label: 'Very Dissatisfied',
    },
    2: {
        icon: <SentimentDissatisfiedIcon />,
        label: 'Dissatisfied',
    },
    3: {
        icon: <SentimentSatisfiedIcon />,
        label: 'Neutral',
    },
    4: {
        icon: <SentimentSatisfiedAltIcon />,
        label: 'Satisfied',
    },
    5: {
        icon: <SentimentVerySatisfiedIcon />,
        label: 'Very Satisfied',
    },
}

function IconContainer(props: IconContainerProps) {
    const { value, ...other } = props
    return <span {...other}>{customIcons[value].icon}</span>
}

const StyledRating = withStyles((theme: Theme) => ({
    iconFilled: {
        color: theme.palette.primary.main,
    },
    iconHover: {
        color: theme.palette.primary.main,
    },
}))(Rating)

const useStyles = makeStyles((theme: Theme) => ({
    mediumText: {
        fontWeight: theme.typography.fontWeightMedium
    }
}))

const Home = () => {
    const theme = useTheme()
    const classes = useStyles()
    const [ user ] = useUser()
    const today = moment().format('dddd').toLowerCase()
    const [ feedbackState, saveFeedback ] = useFeedbackApi()
    const [ feedbackRate, setFeedbackRate ] = useState(3)
    const [ feedbackMessage, setFeedbackMessage ] = useState('')

    const textField = useMemo(() => (
      ({ inputRef, ...props }: any) => (<TextareaAutosize {...props} />)
    ), [])

    console.log(feedbackMessage)

    useMount(() => {
        window.scrollTo(0, 0)
    })

    useEffect(() => {
        const script = document.createElement('script')
        script.src = 'https://platform.twitter.com/widgets.js'
        script.async = true
        document.body.appendChild(script)

        return () => {
            document.body.removeChild(script)
        }
    }, [])

    function handleFeedbackMessageChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setFeedbackMessage(event.target.value)
    }

    function handleFeedbackRateChange(event: ChangeEvent<{}>, value: number | null) {
        setFeedbackRate(value || 0)
    }

    function handleFeedbackSaveClick() {
        saveFeedback({ rate: feedbackRate, message: feedbackMessage })
    }

    return (
      <Container maxWidth="md">
          <Box>
              <Typography variant="h6" gutterBottom>Hi {user!.fullName},</Typography>
              <Typography paragraph>How are you today? Hope you're having a wonderful {today}.</Typography>
          </Box>

          <Box mt={4}>
              <Typography variant="h6" gutterBottom>
                  Start hunting for toxic bots <TrackChangesRoundedIcon style={{ marginBottom: -6 }} />
              </Typography>
              <Typography paragraph>
                  To start hunting you'll have to make a new tweet using words that might trigger toxic bots (or even
                  some unwanted toxic followers) that will work as a trap for them. Then a list of people who answered
                  your tweet will appear showing some information about the answer and you will have four options: mute
                  everyone, mute each one, scan for bot score, mute by score.
              </Typography>
              <Typography>
                  <span className={classes.mediumText}>Mute everyone</span>: You can mute everyone who answered the trap
                  tweet.<br />
                  <span className={classes.mediumText}>Mute each one</span>: You can mute each one of the list manually.<br />
                  <span className={classes.mediumText}>Scan for bot score</span>: You can scan everyone who answered the
                  trap tweet and get their bot score, that is the probability of the profile being a bot.<br />
                  <span className={classes.mediumText}>Mute by score</span>: Then, after you scanned, you'll be able to
                  mute every one that have a specific range of CAP.
              </Typography>
              <Box my={2}>
                  <Button
                    color="primary"
                    variant="contained"
                    disableElevation
                    startIcon={<TrackChangesRoundedIcon />}
                  >Tweet trap</Button>
              </Box>
          </Box>

          <Box mt={4}>
              {([ 'empty', 'loading' ].includes(feedbackState.status)) && <>
                  <Typography variant="h6" gutterBottom>Give your feedback</Typography>
                  <Typography paragraph>Are you enjoying the <strong>Twitter Toxic-bot Filter</strong>?</Typography>
                  <Box component="fieldset" mb={2} p={1} pb={0} pt={1} borderColor="transparent" margin={0} border={0}>
                      <StyledRating
                        name="customized-icons"
                        defaultValue={feedbackRate}
                        onChange={handleFeedbackRateChange}
                        getLabelText={(value: number) => customIcons[value].label}
                        IconContainerComponent={IconContainer}
                        disabled={feedbackState.status === 'loading'}
                      />
                  </Box>
                  <TextField
                    id="outlined-basic"
                    label="Message"
                    variant="outlined"
                    style={{ maxWidth: 400, display: 'flex' }}
                    fullWidth
                    InputProps={{ inputComponent: textField }}
                    defaultValue={feedbackMessage}
                    onChange={handleFeedbackMessageChange}
                    disabled={feedbackState.status === 'loading'}
                    error={feedbackMessage.length > 1500}
                    FormHelperTextProps={{}}
                    helperText={feedbackMessage.length > 1500 ? feedbackMessage.length + '/1500' : undefined}
                  />
                  <Box my={2} display="flex" alignItems="center">
                      <Button
                        color="primary"
                        variant="contained"
                        disableElevation
                        startIcon={<SendRoundedIcon />}
                        onClick={handleFeedbackSaveClick}
                        disabled={feedbackMessage.length > 1500 || feedbackState.status === 'loading'}
                      >Send</Button>

                      {feedbackState.status === 'loading' &&
                      <CircularProgress size={theme.spacing(3)} style={{ marginLeft: theme.spacing(2) }} />
                      }
                  </Box>
              </>}
              {feedbackState.status === 'success' && <>
                  <Typography variant="h6" gutterBottom>Your feedback was sent</Typography>
                  <Typography>Thanks for your feedback! <span role="img" aria-label="heart emoji">❤️</span></Typography>
              </>}
              {feedbackState.status === 'error' && <>
                  <Typography variant="h6" gutterBottom>Give your feedback</Typography>
                  <Typography paragraph>
                      There was a problem while trying to send your feedback. <span role="img"
                                                                                    aria-label="crying emoji">😢</span>
                  </Typography>
                  <Typography paragraph>
                      Please, try again later.
                  </Typography>
              </>}
          </Box>

          <Box mt={4}>
              <Typography variant="h6" gutterBottom>Share with your friends</Typography>
              <Box>
                  <a href="https://twitter.com/share?ref_src=twsrc%5Etfw"
                     className="twitter-share-button"
                     data-size="large"
                     data-text="Hey. Check out this app to mute toxic bots on Twitter. It&#39;s amazing!"
                     data-url="https://twitter-toxic-bot-filter.italodeandra.de/"
                     data-related="italodeandra"
                     data-show-count="true"
                     style={{ display: 'none' }}
                  >Tweet</a>
              </Box>
          </Box>
      </Container>
    )
}

export default Home