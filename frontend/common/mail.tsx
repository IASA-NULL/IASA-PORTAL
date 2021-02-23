import * as React from 'react'
import { withRouter } from 'react-router-dom'

import { Button } from '@rmwc/button'
import { Typography } from '@rmwc/typography'
import {
    DataTable,
    DataTableBody,
    DataTableCell,
    DataTableContent,
    DataTableHead,
    DataTableHeadCell,
    DataTableRow,
} from '@rmwc/data-table'
import { createSnackbarQueue, SnackbarQueue } from '@rmwc/snackbar'

import { MailDB, MailListResponse } from '../../scheme/api/Mail'
import { token } from '../../scheme/api/auth'
import { BrIfMobile, fetchAPI } from '../util'

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

    public componentDidMount() {
        this.refresh()
    }

    public refresh() {
        this.setState({ loaded: false })
        fetchAPI('GET', {}, 'mail')
            .then((res: MailListResponse) => {
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

    public render() {
        let tableBody
        if (this.state?.loaded) {
            try {
                tableBody = this.state.data.data
                    .map((el: MailDB) => {
                        try {
                            let time = new Date(el.date),
                                formattedDate = `${time.getFullYear()}/${
                                    time.getMonth() + 1
                                }/${time.getDate()} ${time.getHours()}:${time.getMinutes()}`
                            return (
                                <DataTableRow
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => {
                                        this.props.history.push(
                                            '/mail/' + el.eid
                                        )
                                    }}>
                                    <DataTableCell alignEnd>
                                        {el.subject}
                                    </DataTableCell>
                                    <DataTableCell>
                                        {el.from.text}
                                    </DataTableCell>
                                    <DataTableCell alignEnd>
                                        {formattedDate}
                                    </DataTableCell>
                                </DataTableRow>
                            )
                        } catch (e) {
                            return null
                        }
                    })
                    .filter((x) => x)
            } catch (e) {}
            if (!tableBody || tableBody.length === 0) {
                let message
                try {
                    message = this.state.data.message
                } catch (e) {}
                if (!message) message = '받은 메일이 없어요!'
                tableBody = (
                    <DataTableRow>
                        <DataTableCell>
                            <div>{message}</div>
                        </DataTableCell>
                        <DataTableCell />
                        <DataTableCell />
                    </DataTableRow>
                )
            }
        } else
            tableBody = (
                <DataTableRow>
                    <DataTableCell>
                        <div>로딩 중...</div>
                    </DataTableCell>
                    <DataTableCell />
                    <DataTableCell />
                </DataTableRow>
            )
        return (
            <div>
                <Typography use='headline3'>메일</Typography>
                <BrIfMobile />
                <Typography use='subtitle1' style={{ marginLeft: '10px' }}>
                    받은 이메일을 확인할 수 있어요.
                </Typography>
                <br />
                <br />
                <DataTable
                    stickyRows={1}
                    stickyColumns={0}
                    style={{
                        width: 'calc(100% - 40px)',
                        margin: '20px',
                        maxHeight: 'calc(100vh - 300px)',
                    }}>
                    <DataTableContent>
                        <DataTableHead>
                            <DataTableRow>
                                <DataTableHeadCell>제목</DataTableHeadCell>
                                <DataTableHeadCell>보낸 사람</DataTableHeadCell>
                                <DataTableHeadCell>받은 시간</DataTableHeadCell>
                            </DataTableRow>
                        </DataTableHead>
                        <DataTableBody>{tableBody}</DataTableBody>
                    </DataTableContent>
                </DataTable>
                <br />
                <br />
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

export default withRouter(Mail)
