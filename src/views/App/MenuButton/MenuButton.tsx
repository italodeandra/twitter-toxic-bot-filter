import { IconButton, PropTypes } from '@material-ui/core'
import React, { FunctionComponent, useRef } from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { animated, useTransition } from 'react-spring'
import { MenuOpenRounded as MenuOpenRoundedIcon, MenuRounded as MenuRoundedIcon } from '@material-ui/icons'

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        height: 48
    },

    menuButton: {
        marginRight: theme.spacing(2),
        overflow: 'hidden'
    },
}))

interface Props {
    isMobile: boolean
    open: boolean
    className?: string
    onClick: () => void
    location: 'drawer' | 'app-bar'
    ariaLabel?: string
    color?: PropTypes.Color
    edge?: 'start' | 'end' | false
    isSignedIn: boolean
}

const MenuButton: FunctionComponent<Props> = ({
                                                  isMobile,
                                                  open,
                                                  className,
                                                  onClick,
                                                  location,
                                                  ariaLabel,
                                                  color,
                                                  edge,
                                                  isSignedIn
                                              }) => {
    const classes = useStyles()
    const ref = useRef<HTMLDivElement>(null)

    let show = isSignedIn
    if (isSignedIn) {
        if (location === 'app-bar') {
            show = isMobile || !open
        } else if (location === 'drawer') {
            show = !isMobile && open
        }
    }

    const transitions = useTransition(show, null, {
        immediate: !ref.current,
        from: { opacity: 0, width: 0, transform: `translateX(${location === 'app-bar' ? -48 : 48}px)` },
        enter: { opacity: 1, width: 48, transform: 'translateX(0px)' },
        leave: { opacity: 0, width: 0, transform: `translateX(${location === 'app-bar' ? -48 : 48}px)` },
    })

    return (
      <div className={classes.root} ref={ref}>
          {transitions.map(({ item, key, props }) =>
            item && (
              <animated.div
                key={key}
                style={props}
              >
                  <IconButton
                    aria-label={ariaLabel}
                    color={color}
                    edge={edge}
                    onClick={onClick}
                    className={className}
                  >
                      {location === 'drawer' && <MenuOpenRoundedIcon />}
                      {location === 'app-bar' && <MenuRoundedIcon />}
                  </IconButton>
              </animated.div>
            )
          )}
      </div>
    )
}

export default MenuButton