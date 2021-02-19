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
    MyeonbulDB,
    MyeonbulQuery,
    MyeonbulRequestListType,
    MyeonbulResponseType,
} from '../../scheme/api/myeonbul'
import { Permission, token } from '../../scheme/api/auth'
import { BrIfMobile, fetchAPI, focusNextInput, SearchUser } from '../util'
import { UserInfo } from '../../scheme/user'

interface MyeonbulProps {
    data: token
}

interface MyeonbulState {
    data?: MyeonbulQuery
    loaded: boolean
    teacherSelectOpened: boolean
    selectedStudent: UserInfo
    teacherSearch: string
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
    }

    public componentDidMount() {
        this.refresh()
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
        ).then((res: MyeonbulQuery) => {
            if (res.success) {
                this.setState({ loaded: true, data: res })
            }
        })
    }

    public register() {
        this.notify({
            title: <b>성공!</b>,
            body: '면불 신청에 성공했어요.',
            icon: 'check',
            dismissIcon: true,
        })
        this.refresh()
    }

    public response(mid: string, stat: boolean) {
        fetchAPI(
            'PUT',
            {
                type: stat
                    ? MyeonbulResponseType.ACCEPT
                    : MyeonbulResponseType.DENY,
            },
            'myeonbul',
            mid,
            'response'
        )
            .then((res) => {
                if (res.success) {
                    this.notify({
                        title: <b>성공!</b>,
                        body: '정상적으로 처리됐어요.',
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
                                }/${end.getDate()} ${begin.getHours()}:${begin.getMinutes()} - ${end.getHours()}:${end.getMinutes()}`
                            else
                                formattedDate = `${begin.getFullYear()}/${
                                    begin.getMonth() + 1
                                }/${begin.getDate()} ${begin.getHours()}:${begin.getMinutes()} - ${end.getFullYear()}/${
                                    end.getMonth() + 1
                                }/${end.getDate()} ${end.getHours()}:${end.getMinutes()}`
                            return (
                                <DataTableRow>
                                    <DataTableCell>
                                        {formattedDate}
                                    </DataTableCell>
                                    <DataTableCell alignEnd>
                                        {el.place}
                                    </DataTableCell>
                                    <DataTableCell alignEnd>
                                        {el.target.name}
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
                                            onClick={(e) => {
                                                this.response(
                                                    el.mid,
                                                    (e.target as HTMLInputElement)
                                                        .checked
                                                )
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
                <Typography use='headline3'>면불</Typography>
                <BrIfMobile />
                <Typography use='subtitle1' style={{ marginLeft: '10px' }}>
                    면불을 생성/승인하거나 면불대장을 출력할 수 있어요.
                </Typography>
                <br />
                <br />
                <Typography use='headline5'>면불 생성</Typography>
                <br />
                <Grid>
                    <GridRow>
                        <GridCell desktop={4} tablet={4} phone={4}>
                            <TextField
                                style={{ width: '100%', height: '100%' }}
                                outlined
                                label='면불 시간'
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') focusNextInput()
                                }}
                            />
                        </GridCell>
                        <GridCell desktop={4} tablet={4} phone={4}>
                            <TextField
                                style={{ width: '100%', height: '100%' }}
                                outlined
                                label='면불 장소'
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
                                type={[Permission.student]}
                                label='학생 검색'
                                onSelect={(user: UserInfo) => {
                                    this.setState({ selectedStudent: user })
                                }}
                            />
                        </GridCell>
                        <GridCell desktop={8} tablet={4} phone={4}>
                            <TextField
                                style={{ width: '100%', height: '100%' }}
                                outlined
                                label='면불 사유'
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
                <Typography use='headline5'>면불 승인</Typography>
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
                                <DataTableHeadCell alignEnd>
                                    승인
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
                <Typography use='headline5'>면불대장 출력</Typography>
                <BrIfMobile />
                <Typography use='subtitle1' style={{ marginLeft: '10px' }}>
                    면불대장을 출력하거나 pdf로 저장할 수 있어요.
                </Typography>
                <br />
                <br />
                <SnackbarQueue messages={this.messages} />
            </div>
        )
    }
}

export default Myeonbul
