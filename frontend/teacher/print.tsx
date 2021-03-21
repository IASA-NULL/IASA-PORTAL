import * as React from 'react'

import { Button } from '@rmwc/button'
import { Typography } from '@rmwc/typography'
import { LinearProgress } from '@rmwc/linear-progress'
import {
    DataTable,
    DataTableContent,
    DataTableHead,
    DataTableRow,
    DataTableHeadCell,
    DataTableBody,
    DataTableCell,
} from '@rmwc/data-table'
import { createSnackbarQueue, SnackbarQueue } from '@rmwc/snackbar'

import {
    PHID,
    PrintHistory,
    PrintHistoryOne,
    PrintHistoryResponse,
} from '../../scheme/api/print'
import { token } from '../../scheme/api/auth'
import { BrIfMobile, fetchAPI } from '../util'
import { formatTimeD } from '../../scheme/time'
import { IconButton } from '@rmwc/icon-button'
import commonApi from '../../scheme/api/commonApi'

interface PenaltyProps {
    data: token
}

interface PenaltyState {
    data?: PrintHistoryResponse
    loaded: boolean
}

class Penalty extends React.Component<PenaltyProps, PenaltyState> {
    messages: any
    notify: any

    constructor(props: PenaltyProps) {
        super(props)
        let qu = createSnackbarQueue()
        this.messages = qu.messages
        this.notify = qu.notify
    }

    public componentDidMount() {
        this.refresh()
    }

    public remove(phid: PHID) {
        fetchAPI('DELETE', {}, 'print', phid)
            .then((res: commonApi) => {
                if (res.success)
                    this.notify({
                        title: <b>성공!</b>,
                        body: '내역 삭제에 성공했어요.',
                        icon: 'check',
                        dismissIcon: true,
                    })
                else
                    this.notify({
                        title: <b>오류</b>,
                        body: res.message,
                        icon: 'error_outline',
                        dismissIcon: true,
                    })
                setTimeout(() => {
                    this.refresh()
                }, 0)
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

    public refresh() {
        this.setState({ loaded: false })
        fetchAPI('GET', {}, 'print')
            .then((res: PrintHistoryResponse) => {
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
                    .map((el: PrintHistoryOne) => {
                        try {
                            let time = new Date(el.time)
                            return (
                                <DataTableRow>
                                    <DataTableCell alignEnd>
                                        {el.sid}
                                    </DataTableCell>
                                    <DataTableCell>{`${time.getFullYear()}/${
                                        time.getMonth() + 1
                                    }/${time.getDate()} ${formatTimeD(
                                        time
                                    )}`}</DataTableCell>
                                    <DataTableCell alignEnd>
                                        {el.count}
                                    </DataTableCell>
                                    <DataTableCell alignEnd>
                                        {el.cid}
                                    </DataTableCell>
                                    <DataTableCell alignEnd>
                                        <IconButton
                                            icon='delete'
                                            onClick={() => {
                                                this.remove(el.phid)
                                            }}
                                        />
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
                if (!message) message = '출력 내역이 없어요!'
                tableBody = (
                    <DataTableRow>
                        <DataTableCell>
                            <div>{message}</div>
                        </DataTableCell>
                        <DataTableCell />
                        <DataTableCell />
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
                    <DataTableCell />
                    <DataTableCell />
                </DataTableRow>
            )
        return (
            <div>
                <Typography use='headline3'>프린트</Typography>
                <BrIfMobile />
                <Typography use='subtitle1' style={{ marginLeft: '10px' }}>
                    프린트 사용 명부를 확인할 수 있어요.
                </Typography>
                <br />
                <br />
                <Typography use='headline5'>출력 내역</Typography>
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
                                <DataTableHeadCell>학번</DataTableHeadCell>
                                <DataTableHeadCell>시간</DataTableHeadCell>
                                <DataTableHeadCell>장수</DataTableHeadCell>
                                <DataTableHeadCell>출력 위치</DataTableHeadCell>
                                <DataTableHeadCell alignEnd>
                                    작업
                                </DataTableHeadCell>
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

export default Penalty
