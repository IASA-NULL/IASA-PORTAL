import * as React from 'react'

import { Typography } from '@rmwc/typography'
import { DataTableCell, DataTableRow } from '@rmwc/data-table'
import { createSnackbarQueue, SnackbarQueue } from '@rmwc/snackbar'

import { token } from '../../scheme/api/auth'
import { BrIfMobile, fetchAPI } from '../util'
import { UserInfo } from '../../scheme/user'
import { dateToString, TimeRange } from '../../scheme/time'
import { IconButton } from '@rmwc/icon-button'
import Table from '../util/table'
import { uuid } from '../../backend/util/random'

interface BuskingProps {
    data: token
}

interface BuskingState {
    loaded: boolean
    teacherSelectOpened: boolean
    selectedStudent: UserInfo
    teacherSearch: string
    selectedTime: TimeRange
    selectedPlace: string
    reason: string
    refreshToken: string
}

class Busking extends React.Component<BuskingProps, BuskingState> {
    messages: any
    notify: any
    lastInput: any

    constructor(props: BuskingProps) {
        super(props)
        let qu = createSnackbarQueue()
        this.messages = qu.messages
        this.notify = qu.notify
        this.handleChange = this.handleChange.bind(this)
    }

    public componentDidMount() {
        this.refresh()
    }

    public handleChange(e: React.FormEvent<HTMLInputElement>, target: string) {
        // @ts-ignore
        this.setState({ [target]: e.target.value })
    }

    public refresh() {
        this.setState({ refreshToken: uuid() })
    }

    public cancel(pid: string) {
        fetchAPI('DELETE', {}, 'busking', pid)
            .then((res) => {
                if (res.success) {
                    this.notify({
                        title: <b>성공!</b>,
                        body: '정상적으로 삭제했어요.',
                        icon: 'check',
                        dismissIcon: true,
                    })
                } else
                    this.notify({
                        title: <b>오류</b>,
                        body: res.message,
                        icon: 'error_outline',
                        dismissIcon: true,
                    })
                this.refresh()
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
        return (
            <div>
                <Typography use='headline3'>버스킹</Typography>
                <BrIfMobile />
                <Typography use='subtitle1' style={{ marginLeft: '10px' }}>
                    사이언스 버스킹 2회차 신청자 명단을 확인할 수 있어요.
                </Typography>
                <br />
                <br />
                <Typography use='headline5'>목록</Typography>
                <br />
                <Table
                    apiOption={['busking']}
                    dataHandler={(el: any) => {
                        return (
                            <DataTableRow>
                                <DataTableCell>
                                    {dateToString(el.time)}
                                </DataTableCell>
                                <DataTableCell>{el.name}</DataTableCell>
                                <DataTableCell>{el.call}</DataTableCell>
                                <DataTableCell>
                                    <IconButton
                                        icon='delete'
                                        onClick={() => {
                                            this.cancel(el.pid)
                                        }}
                                    />
                                </DataTableCell>
                            </DataTableRow>
                        )
                    }}
                    cols={['신청 시각', '이름', '전화번호', '작업']}
                    notify={this.notify}
                    key={this.state?.refreshToken}
                    emptyMessage='신청 내역이 없어요!'
                />
                <SnackbarQueue messages={this.messages} />
            </div>
        )
    }
}

export default Busking
