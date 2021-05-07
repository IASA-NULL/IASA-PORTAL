import * as React from 'react'

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
import { Checkbox } from '@rmwc/checkbox'
import { TextField } from '@rmwc/textfield'
import { Grid, GridCell, GridRow } from '@rmwc/grid'
import { createSnackbarQueue, SnackbarQueue } from '@rmwc/snackbar'

import {
    getMyeonbulTime,
    MID,
    MyeonbulDB,
    MyeonbulQuery,
    MyeonbulRequestListType,
    MyeonbulResponseType,
    MyeonbulTimeType,
} from '../../scheme/api/myeonbul'
import { Permission, token } from '../../scheme/api/auth'
import {
    BrIfMobile,
    fetchAPI,
    focusNextInput,
    SearchUser,
    TimeSelect,
} from '../util'
import { UserInfo } from '../../scheme/user'
import { formatTimeD, TimeRange } from '../../scheme/time'
import { IconButton } from '@rmwc/icon-button'
import createURL from '../../scheme/url'
import commonApi from '../../scheme/api/commonApi'

interface BuskingProps {
    data: token
}

interface BuskingState {
    data?: commonApi
    loaded: boolean
    teacherSelectOpened: boolean
    selectedStudent: UserInfo
    teacherSearch: string
    selectedTime: TimeRange
    selectedPlace: string
    reason: string
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
        this.setState({ loaded: false })
        fetchAPI('GET', {}, 'busking')
            .then((res: commonApi) => {
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
        let tableBody
        if (this.state?.loaded) {
            try {
                tableBody = this.state.data.data
                    .map(
                        (el: {
                            time: number
                            name: string
                            call: string
                            pid: string
                        }) => {
                            try {
                                let time = new Date(el.time)
                                return (
                                    <DataTableRow>
                                        <DataTableCell>
                                            {`${time.getFullYear()}/${
                                                time.getMonth() + 1
                                            }/${time.getDate()} ${formatTimeD(
                                                time
                                            )}`}
                                        </DataTableCell>
                                        <DataTableCell alignEnd>
                                            {el.name}
                                        </DataTableCell>
                                        <DataTableCell alignEnd>
                                            {el.call}
                                        </DataTableCell>
                                        <DataTableCell alignEnd>
                                            <IconButton
                                                icon='delete'
                                                onClick={() => {
                                                    this.cancel(el.pid)
                                                }}
                                            />
                                        </DataTableCell>
                                    </DataTableRow>
                                )
                            } catch (e) {
                                return null
                            }
                        }
                    )
                    .filter((x: any) => x)
            } catch (e) {}
            if (!tableBody || tableBody.length === 0) {
                let message
                try {
                    message = this.state.data.message
                } catch (e) {}
                if (!message) message = '신청 내역이 없어요!'
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
                <Typography use='headline3'>버스킹</Typography>
                <BrIfMobile />
                <Typography use='subtitle1' style={{ marginLeft: '10px' }}>
                    사이언스 버스킹 신청자 명단을 확인할 수 있어요.
                </Typography>
                <br />
                <br />
                <Typography use='headline5'>목록</Typography>
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
                                <DataTableHeadCell>신청 시간</DataTableHeadCell>
                                <DataTableHeadCell>이름</DataTableHeadCell>
                                <DataTableHeadCell>전화번호</DataTableHeadCell>
                                <DataTableHeadCell alignEnd>
                                    작업
                                </DataTableHeadCell>
                            </DataTableRow>
                        </DataTableHead>
                        <DataTableBody>{tableBody}</DataTableBody>
                    </DataTableContent>
                </DataTable>
                <br />
                <Button
                    outlined
                    onClick={this.refresh.bind(this)}
                    style={{ marginLeft: '20px' }}>
                    새로고침
                </Button>
                <br />
                <br />
                <SnackbarQueue messages={this.messages} />
            </div>
        )
    }
}

export default Busking
