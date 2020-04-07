import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grow
} from '@material-ui/core'
import React, { FunctionComponent } from 'react'
import { State } from '../../../../../api/apiReducer'
import { ClassNameMap } from '@material-ui/styles/withStyles'
import useMuteCustomHook from '../useMuteCustomHook'

interface Props {
    selectedNames: string[]
    classes: ClassNameMap
    tweetTrapRepliesState: State
    tweetTrapState: State
    getNames: () => string[]
    getTweetTrapReplies: () => void
}

const TweetTrapSelectedMuteConfirmDialog: FunctionComponent<Props> = ({
                                                                          selectedNames,
                                                                          classes,
                                                                          tweetTrapRepliesState,
                                                                          tweetTrapState,
                                                                          getNames,
                                                                          getTweetTrapReplies
                                                                      }) => {
    const [ theme, handleMuteClick, handleDialogClose, mute, open, muteState ] = useMuteCustomHook(getTweetTrapReplies)

    function getNamesJoined(): string {
        let names: string[] = getNames()
        return names.length ? names.join(', ') : 'none'
    }

    function handleConfirmMute() {
        mute(getNames())
    }

    return (<>
        <Button
          variant="contained"
          disableElevation
          color="primary"
          type="submit"
          disabled={![ tweetTrapState.status, tweetTrapRepliesState.status ].includes('success') || muteState.status === 'loading'}
          className={classes.buttonSpacing}
          onClick={handleMuteClick}
        >Mute {selectedNames.length || 'all'}</Button>
        <Dialog onClose={handleDialogClose} aria-labelledby="simple-dialog-title" open={open}
                TransitionComponent={Grow}>
            <DialogTitle id="simple-dialog-title">Mute {selectedNames.length || 'all'}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    You're going to mute: {getNamesJoined()}
                </DialogContentText>
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
                  disabled={getNamesJoined() === 'none' || muteState.status === 'loading'}
                >
                    Mute
                </Button>
            </DialogActions>
        </Dialog>
    </>)
}

export default TweetTrapSelectedMuteConfirmDialog