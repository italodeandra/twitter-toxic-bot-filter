import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grow,
    InputAdornment,
    TextField,
    Tooltip
} from '@material-ui/core'
import React, { ChangeEvent, FunctionComponent, useState } from 'react'
import { State } from '../../../../../api/apiReducer'
import { ClassNameMap } from '@material-ui/styles/withStyles'
import BotScore from '../../../../../api/botScore/BotScore'
import { default as ETweetTrap } from '../../../../../api/tweetTrap/TweetTrap'
import useMuteCustomHook from '../useMuteCustomHook'

interface Props {
    botScoreState: State
    selectedNames: string[]
    classes: ClassNameMap
    tweetTrapRepliesState: State
    getTweetTrapReplies: () => void
}

const TweetTrapSelectedMuteByBotScoreDialog: FunctionComponent<Props> = ({
                                                                             botScoreState,
                                                                             selectedNames,
                                                                             classes,
                                                                             tweetTrapRepliesState,
                                                                             getTweetTrapReplies
                                                                         }) => {
    const [ selectedScore, setSelectedScore ] = useState<number | string>('')
    const [ theme, handleMuteClick, handleDialogClose, mute, open, muteState ] = useMuteCustomHook(getTweetTrapReplies)

    function handleScoreChange(event: ChangeEvent<HTMLInputElement>) {
        const value = event.target.value.replace(/\D/g, '')
        if (value !== '') {
            setSelectedScore(+value)
        } else {
            setSelectedScore('')
        }
    }

    function filterToMute(): string {
        let toMute = 'none'

        if (selectedScore !== '') {
            let names: string[] = []

            if (tweetTrapRepliesState.status === 'success') {
                for (let tweetTrap of tweetTrapRepliesState.data as ETweetTrap[]) {
                    if (!names.includes(tweetTrap.createdBy!.screenName!)) {
                        names.push(tweetTrap.createdBy!.screenName!)
                    }
                }
            }

            if (botScoreState.status === 'success') {
                const toMuteList = botScoreState.data
                  .filter((s: BotScore) => names.includes(s.name) && Math.round(s.score) >= selectedScore!)
                  .map((s: BotScore) => s.name)
                toMute = toMuteList.length ? toMuteList.join(', ') : 'none'
            }
        }

        return toMute
    }

    function handleConfirmMute() {
        let names: string[] = []

        if (tweetTrapRepliesState.status === 'success') {
            for (let tweetTrap of tweetTrapRepliesState.data as ETweetTrap[]) {
                if (!names.includes(tweetTrap.createdBy!.screenName!)) {
                    names.push(tweetTrap.createdBy!.screenName!)
                }
            }
        }

        if (botScoreState.status === 'success') {
            names = botScoreState.data
              .filter((s: BotScore) => names.includes(s.name) && Math.round(s.score) >= selectedScore!)
              .map((s: BotScore) => s.name)
        }

        mute(names)
    }

    return (<>
        <Tooltip
          disableHoverListener={botScoreState.status === 'success' || [ tweetTrapRepliesState.status, botScoreState.status ].includes('loading')}
          disableTouchListener={botScoreState.status === 'success' || [ tweetTrapRepliesState.status, botScoreState.status ].includes('loading')}
          disableFocusListener={botScoreState.status === 'success' || [ tweetTrapRepliesState.status, botScoreState.status ].includes('loading')}
          title={`You need to first scan ${selectedNames.length ? `the ${selectedNames.length} selected` : 'the'} profile${selectedNames.length !== 1 ? 's' : ''}`}>
            <span className={classes.buttonSpacing}>
                <Button
                  variant="contained"
                  disableElevation
                  color={botScoreState.status === 'success' ? 'primary' : undefined}
                  type="submit"
                  onClick={botScoreState.status === 'success' ? handleMuteClick : undefined}
                  disabled={[ tweetTrapRepliesState.status, botScoreState.status ].includes('loading')}
                >Mute by bot score</Button>
            </span>
        </Tooltip>
        <Dialog onClose={handleDialogClose} aria-labelledby="simple-dialog-title" open={open}
                TransitionComponent={Grow}>
            <DialogTitle id="simple-dialog-title">Mute by bot score</DialogTitle>
            <DialogContent>
                <Box>
                    <TextField
                      autoFocus
                      variant="outlined"
                      label="Mute with at least"
                      InputProps={{
                          endAdornment: <InputAdornment position="end">%</InputAdornment>
                      }}
                      value={selectedScore}
                      onChange={handleScoreChange}
                      fullWidth
                    />
                </Box>
                <Box mt={2}>
                    <DialogContentText>
                        You're going to mute: {filterToMute()}
                    </DialogContentText>
                </Box>
            </DialogContent>
            <DialogActions>
                {muteState.status === 'loading'
                  ? <CircularProgress size={theme.spacing(3)} style={{ marginRight: theme.spacing(2) }} />
                  : <Button onClick={handleDialogClose}>
                      Cancel
                  </Button>
                }
                <Button
                  onClick={handleConfirmMute}
                  variant="contained"
                  disableElevation
                  color="primary"
                  disabled={filterToMute() === 'none' || muteState.status === 'loading'}
                >
                    Mute
                </Button>
            </DialogActions>
        </Dialog>
    </>)
}

export default TweetTrapSelectedMuteByBotScoreDialog