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

import { PenaltyResponse, PenaltyResponseOne } from '../../scheme/api/penalty'
import { token } from '../../scheme/api/auth'
import { BrIfMobile, fetchAPI } from '../util'

interface PenaltyProps {
    data: token
}

interface PenaltyState {
    data?: PenaltyResponse
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

    public refresh() {
        this.setState({ loaded: false })
        fetchAPI('GET', {}, 'penalty', 'list').then((res: PenaltyResponse) => {
            if (res.success) {
                this.setState({ loaded: true, data: res })
            }
        })
    }

    public render() {
        let tableBody
        let message: string
        if (this.state?.data?.data?.score >= 0) message = '잘하고 있어요!'
        else if (this.state?.data?.data?.score >= -5)
            message = '벌점을 받지 않도록 노력해봐요.'
        else if (this.state?.data?.data?.score >= -10)
            message = '벌점을 받지 않도록 주의하세요.'
        else if (this.state?.data?.data?.score >= -15)
            message = '벌점을 더 받으면 교내봉사를 해야 해요.'
        else if (this.state?.data?.data?.score >= -21)
            message = '벌점을 더 받으면 기숙사에서 퇴소될 수 있어요!'
        else message = '저런...'
        if (this.state?.loaded) {
            try {
                tableBody = this.state.data.data.history
                    .map((el: PenaltyResponseOne) => {
                        try {
                            let time = new Date(el.time)
                            return (
                                <DataTableRow>
                                    <DataTableCell alignEnd>
                                        {el.score}
                                    </DataTableCell>
                                    <DataTableCell>{`${time.getFullYear()}/${
                                        time.getMonth() + 1
                                    }/${time.getDate()} ${time.getHours()}:${time.getMinutes()}`}</DataTableCell>
                                    <DataTableCell alignEnd>
                                        {el.teacher.name}
                                    </DataTableCell>
                                    <DataTableCell alignEnd>
                                        {el.info}
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
                if (!message) message = '상벌점 내역이 없어요!'
                tableBody = (
                    <DataTableRow>
                        <DataTableCell>
                            <div>{message}</div>
                        </DataTableCell>
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
                </DataTableRow>
            )
        return (
            <div>
                <Typography use='headline3'>벌점</Typography>
                <BrIfMobile />
                <Typography use='subtitle1' style={{ marginLeft: '10px' }}>
                    받은 상벌점을 확인할 수 있어요.
                </Typography>
                <br />
                <br />
                <LinearProgress
                    progress={-this.state?.data?.data?.score / 21.0}
                    buffer={1}
                />
                <br />
                {this.state?.loaded ? (
                    <>
                        <Typography use='headline4'>
                            현재{' '}
                            {this.state?.data?.data?.score > 0
                                ? '상점'
                                : '벌점'}{' '}
                            {Math.abs(this.state?.data?.data?.score)}점이에요.
                        </Typography>
                        <br />
                        <Typography use='subtitle1'>{message}</Typography>
                    </>
                ) : (
                    <Typography use='headline4'>불러오는 중...</Typography>
                )}

                <br />
                <br />
                <Typography use='headline5'>상벌점 내역</Typography>
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
                                <DataTableHeadCell>받은 점수</DataTableHeadCell>
                                <DataTableHeadCell>받은 시간</DataTableHeadCell>
                                <DataTableHeadCell>
                                    부여한 선생님
                                </DataTableHeadCell>
                                <DataTableHeadCell alignEnd>
                                    사유
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
