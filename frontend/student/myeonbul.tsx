import * as React from 'react'

import { Button } from '@rmwc/button'
import { Typography } from '@rmwc/typography'
import { DataTableCell, DataTableRow } from '@rmwc/data-table'
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
import { myeonbulTimtToString, TimeRange } from '../../scheme/time'
import { IconButton } from '@rmwc/icon-button'
import Table from '../util/table'
import { uuid } from '../../backend/util/random'

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
    refreshToken: string
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

    public handleChange(e: React.FormEvent<HTMLInputElement>, target: string) {
        // @ts-ignore
        this.setState({ [target]: e.target.value })
    }

    public refresh() {
        this.setState({ refreshToken: uuid() })
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

    public cancel(mid: MID) {
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
                <Table
                    apiOption={{
                        target: ['myeonbul', 'list'],
                        method: 'POST',
                        body: { type: MyeonbulRequestListType.listByUser },
                    }}
                    dataHandler={(el: MyeonbulDB) => {
                        return (
                            <DataTableRow>
                                <DataTableCell>
                                    {myeonbulTimtToString(el.timeRange)}
                                </DataTableCell>
                                <DataTableCell>{el.place}</DataTableCell>
                                <DataTableCell>{el.teacher.name}</DataTableCell>
                                <DataTableCell>{el.reason}</DataTableCell>
                                <DataTableCell>
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
                                <DataTableCell>
                                    <IconButton
                                        icon='delete'
                                        onClick={() => {
                                            this.cancel(el.mid)
                                        }}
                                    />
                                </DataTableCell>
                            </DataTableRow>
                        )
                    }}
                    cols={[
                        '면불 시간',
                        '면불 장소',
                        '담당 선생님',
                        '면불 사유',
                        '승인 여부',
                        '작업',
                    ]}
                    notify={this.notify}
                    key={this.state?.refreshToken}
                    emptyMessage='면불 내역이 없어요!'
                />
                <SnackbarQueue messages={this.messages} />
            </div>
        )
    }
}

export default Myeonbul
