import { Divider, ListItem, ListItemAvatar, ListItemText } from '@material-ui/core'
import React from 'react'
import { Skeleton } from '@material-ui/lab'

const TweetTrapListSkeleton = () => {
    return (<>
        {[ 0, 1, 2 ].map(i => (<div key={i}>
            {i !== 0 &&
            <Divider variant="inset" component="li" />
            }
            <ListItem alignItems="flex-start">
                <ListItemAvatar>
                    <Skeleton variant="circle" width={40} height={40} />
                </ListItemAvatar>
                <ListItemText
                  primary={
                      <Skeleton variant="text" style={{ maxWidth: 150 }} />
                  }
                  secondary={
                      <Skeleton variant="text" style={{ maxWidth: 500 }} />
                  }
                />
            </ListItem>
        </div>))}
    </>)
}

export default TweetTrapListSkeleton