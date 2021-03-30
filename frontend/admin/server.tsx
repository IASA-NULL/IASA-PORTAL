import * as React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'

import { Button } from '@rmwc/button'
import { Typography } from '@rmwc/typography'
import { Select } from '@rmwc/select'

import { BrIfMobile, fetchAPI, RequireSudo } from '../util'
import { createSnackbarQueue, SnackbarQueue } from '@rmwc/snackbar'
import commonApi from '../../scheme/api/commonApi'

interface IState {
    data: commonApi
}

class Server extends React.Component<any, IState> {
    messages: any
    notify: any

    constructor(props: RouteComponentProps) {
        RequireSudo()
        super(props)
        let qu = createSnackbarQueue()
        this.messages = qu.messages
        this.notify = qu.notify
        this.refresh()
    }

    public refresh() {}

    public render() {
        return (
            <>
                <Typography use='headline3'>인스턴스 관리</Typography>
                <BrIfMobile />
                <Typography use='subtitle1' style={{ marginLeft: '10px' }}>
                    EC2 인스턴스를 관리해요.
                </Typography>
                <br />
                <br />
                <br />
                <SnackbarQueue messages={this.messages} />
            </>
        )
    }
}

export default withRouter(Server)
