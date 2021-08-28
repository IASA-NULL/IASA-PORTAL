import * as React from 'react'
import { withRouter } from 'react-router-dom'

import { Typography } from '@rmwc/typography'
import { DataTableCell, DataTableRow } from '@rmwc/data-table'
import { createSnackbarQueue, SnackbarQueue } from '@rmwc/snackbar'

import { MailDB, MailListResponse } from '../../scheme/api/Mail'
import { token } from '../../scheme/api/auth'
import { BrIfMobile } from '../util'
import Table from '../util/table'
import { dateToString } from '../../scheme/time'

interface MailProps {
    data: token
    match: any
    location: any
    history: any
}

interface MailState {
    data?: MailListResponse
    loaded: boolean
}

class Mail extends React.Component<MailProps, MailState> {
    messages: any
    notify: any
    lastInput: any

    constructor(props: MailProps) {
        super(props)
        let qu = createSnackbarQueue()
        this.messages = qu.messages
        this.notify = qu.notify
    }

    public render() {
        return (
            <div>
                <Typography use='headline3'>메일</Typography>
                <BrIfMobile />
                <Typography use='subtitle1' style={{ marginLeft: '10px' }}>
                    받은 이메일을 확인할 수 있어요.
                </Typography>
                <br />
                <Table
                    apiOption={['mail']}
                    dataHandler={(el: MailDB) => {
                        return (
                            <DataTableRow
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                    this.props.history.push('/mail/' + el.eid)
                                }}>
                                <DataTableCell>{el.subject}</DataTableCell>
                                <DataTableCell>{el.from.text}</DataTableCell>
                                <DataTableCell>
                                    {dateToString(el.date)}
                                </DataTableCell>
                            </DataTableRow>
                        )
                    }}
                    cols={['제목', '보낸 사람', '받은 시각']}
                    notify={this.notify}
                    emptyMessage='받은 메일이 없어요!'
                />
                <SnackbarQueue messages={this.messages} />
            </div>
        )
    }
}

export default withRouter(Mail)
