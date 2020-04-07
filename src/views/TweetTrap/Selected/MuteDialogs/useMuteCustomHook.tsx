import { Button, useTheme } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import useMuteApi from '../../../../api/mute/useMuteApi'
import { useSnackbar } from 'notistack'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import { State } from '../../../../api/apiReducer'

export default function useMuteCustomHook(getTweetTrapReplies: () => void): [
    Theme, () => void, () => void, (names: string[]) => void, boolean, State
] {
    const theme = useTheme()
    const [ open, setOpen ] = useState(false)
    const [ muteState, { mute } ] = useMuteApi()
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()

    useEffect(() => {
        if (muteState.status === 'success') {
            enqueueSnackbar('Muted successfully')
            setOpen(false)
            getTweetTrapReplies()
        } else if (muteState.status === 'error') {
            enqueueSnackbar('There was an error while trying to mute. Please, try again later.', {
                variant: 'error',
                persist: true,
                action: key => (
                  <Button onClick={() => closeSnackbar(key)} color="inherit">
                      Okay
                  </Button>
                )
            })
            console.error(muteState)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ muteState.status ])

    function handleMuteClick() {
        setOpen(true)
    }

    function handleDialogClose() {
        if (muteState.status !== 'loading') {
            setOpen(false)
        }
    }

    return [ theme, handleMuteClick, handleDialogClose, mute, open, muteState ]
}