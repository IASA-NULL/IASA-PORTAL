import * as React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'

import { Button } from '@rmwc/button'
import { Typography } from '@rmwc/typography'
import { BrIfMobile, requireSudo } from '../util'
import { createSnackbarQueue, SnackbarQueue } from '@rmwc/snackbar'

interface IProps {}

interface IState {
    edit: boolean
}

class MyPage extends React.Component<any, IState> {
    messages: any
    notify: any

    constructor(props: IProps) {
        super(props)
        let qu = createSnackbarQueue()
        this.messages = qu.messages
        this.notify = qu.notify

        const searchParams = new URLSearchParams(window.location.search)
        try {
            const edit = searchParams.get('edit')
            if (edit) {
                requireSudo()
                this.state = { edit: true }
            }
        } catch (e) {}
    }

    public enableEdit() {
        const searchParams = new URLSearchParams(window.location.search)
        searchParams.set('edit', 'true')
        window.history.replaceState(
            null,
            null,
            window.location.pathname + '?' + searchParams.toString()
        )
        this.setState({ edit: true })
        requireSudo()
    }

    public save() {
        const searchParams = new URLSearchParams(window.location.search)
        searchParams.set('edit', '')
        window.history.replaceState(null, null, window.location.pathname)
        this.setState({ edit: false })
        this.notify({
            title: <b>성공!</b>,
            body: '정보를 성공적으로 수정했어요.',
            icon: 'check',
            dismissIcon: true,
        })
    }

    public render() {
        return (
            <>
                <Typography use='headline3'>마이페이지</Typography>
                <BrIfMobile />
                <Typography use='subtitle1' style={{ marginLeft: '10px' }}>
                    내 정보를 보거나 수정할 수 있어요.
                </Typography>
                <br />
                <br />
                <Button
                    onClick={() => {
                        if (this.state?.edit) this.save()
                        else this.enableEdit()
                    }}
                    outlined>
                    {this.state?.edit ? '저장' : '수정하기'}
                </Button>
                <SnackbarQueue messages={this.messages} />
            </>
        )
    }
}

export default withRouter(MyPage)
