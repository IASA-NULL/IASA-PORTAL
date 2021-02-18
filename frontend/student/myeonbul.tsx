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
    selectedTeacher: UserInfo
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
                                        {el.teacher.name}
                                    </DataTableCell>
                                    <DataTableCell alignEnd>
                                        <Checkbox
                                            checked={
                                                el.approved ===
                                                MyeonbulResponseType.ACCEPT
                                            }
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
                    면불을 신청하거나 선생님의 승인 여부를 확인할 수 있어요.
                </Typography>
                <br />
                <br />
                <Typography use='headline5'>면불 신청하기</Typography>
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
                                <DataTableHeadCell alignEnd>
                                    승인 여부
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
