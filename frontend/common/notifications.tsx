import * as React from 'react'
import { Link, withRouter } from 'react-router-dom'

import { Button } from '@rmwc/button'
import { Typography } from '@rmwc/typography'
import { createSnackbarQueue, SnackbarQueue } from '@rmwc/snackbar'

import { token } from '../../scheme/api/auth'
import { BrIfMobile, fetchAPI } from '../util'
import {
    List,
    ListItem,
    ListItemPrimaryText,
    ListItemSecondaryText,
    ListItemText,
    ListItemMeta,
} from '@rmwc/list'
import { IconButton } from '@rmwc/icon-button'
import { NotificationApi } from '../../scheme/api/notification'
import commonApi from '../../scheme/api/commonApi'

interface NotificationsProps {
    data: token
    match: any
    location: any
    history: any
}

interface NotificationState {
    data?: NotificationApi
    loaded: boolean
}

class Notifications extends React.Component<
    NotificationsProps,
    NotificationState
> {
    messages: any
    notify: any
    lastInput: any

    constructor(props: NotificationsProps) {
        super(props)
        let qu = createSnackbarQueue()
        this.messages = qu.messages
        this.notify = qu.notify
    }

    public componentDidMount() {
        this.refresh()
    }

    public refresh() {
        this.setState({ loaded: false })
        fetchAPI('GET', {}, 'notifications')
            .then((res: NotificationApi) => {
                if (res.success) {
                    this.setState({ loaded: true, data: res })
                } else {
                    this.notify({
                        title: <b>오류</b>,
                        body: res.message,
                        icon: 'error_outline',
                        dismissIcon: true,
                    })
                }
            })
            .catch(() => {
                this.notify({
                    title: <b>오류</b>,
                    body: '서버와 연결할 수 없어요.',
                    icon: 'error_outline',
                    dismissIcon: true,
                })
            })
    }

    public remove(nid: string) {
        fetchAPI('DELETE', {}, 'notifications', nid).then((res: commonApi) => {
            if (res.success) {
                this.refresh()
            }
        })
    }

    public render() {
        return (
            <div>
                <Typography use='headline3'>알림</Typography>
                <BrIfMobile />
                <Typography use='subtitle1' style={{ marginLeft: '10px' }}>
                    받은 알림들을 확인할 수 있어요.
                </Typography>
                <br />
                <br />

                {this.state?.loaded ? (
                    this.state?.data?.data?.length ? (
                        this.state?.data?.data?.map((el) => {
                            return (
                                <div style={{ marginLeft: '20px' }}>
                                    <Typography use='headline5'>{`${new Date(
                                        el.date
                                    ).getFullYear()}년 ${
                                        new Date(el.date).getMonth() + 1
                                    }월 ${new Date(
                                        el.date
                                    ).getDate()}일`}</Typography>
                                    <List
                                        style={{
                                            border: '1px solid #dddddd',
                                            borderRadius: '3px',
                                            background: 'white',
                                            padding: '0',
                                            marginTop: '10px',
                                        }}>
                                        {el.notifications.map((notify) => {
                                            return (
                                                <ListItem
                                                    className='mdc-list--two-line'
                                                    style={{
                                                        cursor: 'pointer',
                                                    }}
                                                    onClick={() => {
                                                        this.props.history.push(
                                                            notify.link
                                                        )
                                                    }}>
                                                    <ListItemText>
                                                        <ListItemPrimaryText
                                                            style={{
                                                                color: 'black',
                                                            }}>
                                                            {notify.title}
                                                        </ListItemPrimaryText>
                                                        <ListItemSecondaryText>
                                                            {notify.subtitle}
                                                        </ListItemSecondaryText>
                                                    </ListItemText>
                                                    <ListItemMeta>
                                                        <IconButton
                                                            icon='close'
                                                            label='알림 삭제'
                                                            onClick={(
                                                                e: any
                                                            ) => {
                                                                e.preventDefault()
                                                                e.stopPropagation()
                                                                this.remove(
                                                                    notify.nid
                                                                )
                                                            }}
                                                        />
                                                    </ListItemMeta>
                                                </ListItem>
                                            )
                                        })}
                                    </List>
                                    <br />
                                </div>
                            )
                        })
                    ) : (
                        <>
                            <Typography
                                use='headline5'
                                style={{ marginLeft: '20px' }}>
                                알림이 없어요!
                            </Typography>
                            <br />
                            <br />
                        </>
                    )
                ) : (
                    <>
                        <Typography
                            use='headline5'
                            style={{ marginLeft: '20px' }}>
                            불러오는 중...
                        </Typography>
                        <br />
                        <br />
                    </>
                )}

                <Button
                    outlined
                    onClick={this.refresh.bind(this)}
                    style={{ marginLeft: '20px' }}>
                    새로고침
                </Button>
                <SnackbarQueue messages={this.messages} />
            </div>
        )
    }
}

export default withRouter(Notifications)
