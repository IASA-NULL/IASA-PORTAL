import * as React from 'react'
import { withRouter } from 'react-router-dom'

import { Typography } from '@rmwc/typography'
import { createSnackbarQueue, SnackbarQueue } from '@rmwc/snackbar'

import { MailListResponse, MailResponse } from '../../scheme/api/Mail'
import { token } from '../../scheme/api/auth'
import { BrIfMobile, fetchAPI } from '../util'
import { IconButton } from '@rmwc/icon-button'

interface MailViewProps {
    data: token
    match: any
    location: any
    history: any
}

interface MailViewState {
    data?: MailResponse
    loaded: boolean
}

class MailView extends React.Component<MailViewProps, MailViewState> {
    messages: any
    notify: any
    lastInput: any

    constructor(props: MailViewProps) {
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
        fetchAPI('GET', {}, 'mail', this.props.match.params.eid).then(
            (res: MailResponse) => {
                if (res.success) {
                    this.setState({ loaded: true, data: res })
                }
            }
        )
    }

    public render() {
        return (
            <div>
                <IconButton
                    icon='arrow_back'
                    onClick={() => {
                        this.props.history.goBack()
                    }}
                    style={{ marginRight: '10px' }}
                />
                <Typography use='headline3'>
                    {this.state?.data?.data?.subject}
                </Typography>
                <BrIfMobile />
                <Typography use='subtitle1' style={{ marginLeft: '10px' }}>
                    {this.state?.data?.data?.from?.text}
                </Typography>
                <br />
                <br />
                <div
                    dangerouslySetInnerHTML={{
                        __html:
                            this.state?.data?.data?.html ||
                            this.state?.data?.data?.text ||
                            '',
                    }}
                />
                <SnackbarQueue messages={this.messages} />
            </div>
        )
    }
}

export default withRouter(MailView)
