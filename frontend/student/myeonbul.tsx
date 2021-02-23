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

interface MyeonbulProps {
    data: token
}

interface MyeonbulState {
    data?: MyeonbulQuery
    loaded: boolean
    teacherSelectOpened: boolean
    selectedTeacher: UserInfo
    teacherSearch: string
    selectedTime: TimeRange
    selectedPlace: string
    reason: string
}

class Myeonbul extends React.Component<MyeonbulProps, MyeonbulState> {
    messages: any
    notify: any
    lastInput: any

    constructor(props: MyeonbulProps) {
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
        fetchAPI(
            'POST',
            {
                type: MyeonbulRequestListType.listByUser,
            },
            'myeonbul',
            'list'
        )
            .then((res: MyeonbulQuery) => {
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

    public register() {
        fetchAPI(
            'POST',
            {
                timeRange: this.state?.selectedTime,
                place: this.state?.selectedPlace,
                reason: this.state?.reason,
                teacher: this.state?.selectedTeacher.uid,
            },
            'myeonbul'
        )
            .then((res) => {
                if (res.success)
                    this.notify({
                        title: <b>성공!</b>,
                        body: '면불 신청에 성공했어요.',
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

    public cancel(mid: string) {
        fetchAPI('DELETE', {}, 'myeonbul', mid)
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
                    .map((el: MyeonbulDB) => {
                        try {
                            let formattedDate: string,
                                begin = new Date(el.timeRange.begin),
                                end = new Date(el.timeRange.end)
                            if (el.timeRange.nickname)
                                formattedDate = `${end.getFullYear()}/${
                                    end.getMonth() + 1
                                }/${end.getDate()} ${el.timeRange.nickname}`
                            else if (begin.getDay() === end.getDay())
                                formattedDate = `${end.getFullYear()}/${
                                    end.getMonth() + 1
                                }/${end.getDate()} ${formatTimeD(
                                    begin
                                )} - ${formatTimeD(end)}`
                            else
                                formattedDate = `${begin.getFullYear()}/${
                                    begin.getMonth() + 1
                                }/${begin.getDate()} ${formatTimeD(
                                    begin
                                )} - ${end.getFullYear()}/${
                                    end.getMonth() + 1
                                }/${end.getDate()} ${formatTimeD(end)}`
                            return (
                                <DataTableRow>
                                    <DataTableCell>
                                        {formattedDate}
                                    </DataTableCell>
                                    <DataTableCell alignEnd>
                                        {el.place}
                                    </DataTableCell>
                                    <DataTableCell alignEnd>
                                        {el.teacher.name}
                                    </DataTableCell>
                                    <DataTableCell alignEnd>
                                        {el.reason}
                                    </DataTableCell>
                                    <DataTableCell alignEnd>
                                        <Checkbox
                                            indeterminate={
                                                el.approved ===
                                                MyeonbulResponseType.UNDEFINED
                                            }
                                            checked={
                                                el.approved ===
                                                MyeonbulResponseType.ACCEPT
                                            }
                                        />
                                    </DataTableCell>
                                    <DataTableCell alignEnd>
                                        <IconButton
                                            icon='delete'
                                            onClick={() => {
                                                this.cancel(el.mid)
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
                if (!message) message = '면불 내역이 없어요!'
                tableBody = (
                    <DataTableRow>
                        <DataTableCell>
                            <div>{message}</div>
                        </DataTableCell>
                        <DataTableCell />
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
                    <DataTableCell />
                </DataTableRow>
            )
        return (
            <div>
                <Typography use='headline3'>면불</Typography>
                <BrIfMobile />
                <Typography use='subtitle1' style={{ marginLeft: '10px' }}>
                    면불을 신청하거나 선생님의 승인 여부를 확인할 수 있어요.
                </Typography>
                <br />
                <br />
                <Typography use='headline5'>면불 신청하기</Typography>
                <br />
                <Grid>
                    <GridRow>
                        <GridCell desktop={4} tablet={4} phone={4}>
                            <TimeSelect
                                label='면불 시간'
                                preset={[
                                    getMyeonbulTime(MyeonbulTimeType.WEEKDAY_1),
                                    getMyeonbulTime(MyeonbulTimeType.WEEKDAY_2),
                                    getMyeonbulTime(
                                        MyeonbulTimeType.WEEKDAY_ALL
                                    ),
                                ]}
                                onSelect={(res: TimeRange) => {
                                    this.setState({ selectedTime: res })
                                }}
                            />
                        </GridCell>
                        <GridCell desktop={4} tablet={4} phone={4}>
                            <TextField
                                style={{ width: '100%', height: '100%' }}
                                outlined
                                label='면불 장소'
                                value={this.state?.selectedPlace}
                                onChange={(e) =>
                                    this.handleChange(e, 'selectedPlace')
                                }
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') focusNextInput()
                                }}
                            />
                        </GridCell>
                        <GridCell desktop={4} tablet={4} phone={4}>
                            <SearchUser
                                onKeyDown={(e: any) => {
                                    if (e.key === 'Enter') focusNextInput()
                                }}
                                type={[Permission.teacher]}
                                label='면불 담당 선생님'
                                onSelect={(user: UserInfo) => {
                                    this.setState({ selectedTeacher: user })
                                }}
                            />
                        </GridCell>
                        <GridCell desktop={8} tablet={4} phone={4}>
                            <TextField
                                style={{ width: '100%', height: '100%' }}
                                outlined
                                label='면불 사유'
                                value={this.state?.reason}
                                onChange={(e) => this.handleChange(e, 'reason')}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') this.register()
                                }}
                                ref={(input) => {
                                    this.lastInput = input
                                }}
                            />
                        </GridCell>
                        <GridCell desktop={4} tablet={8} phone={4}>
                            <Button
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    minHeight: '45.2px',
                                }}
                                outlined
                                label='신청'
                                trailingIcon='send'
                                onClick={this.register.bind(this)}
                            />
                        </GridCell>
                    </GridRow>
                </Grid>
                <br />
                <Typography use='headline5'>면불 신청 내역 확인하기</Typography>
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
                                <DataTableHeadCell>면불 시간</DataTableHeadCell>
                                <DataTableHeadCell>면불 장소</DataTableHeadCell>
                                <DataTableHeadCell>
                                    담당 선생님
                                </DataTableHeadCell>
                                <DataTableHeadCell>면불 사유</DataTableHeadCell>
                                <DataTableHeadCell alignEnd>
                                    승인 여부
                                </DataTableHeadCell>
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

export default Myeonbul
