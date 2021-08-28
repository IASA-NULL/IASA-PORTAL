import * as React from 'react'

import { Button } from '@rmwc/button'
import { Typography } from '@rmwc/typography'
import { LinearProgress } from '@rmwc/linear-progress'
import { DataTableRow, DataTableCell } from '@rmwc/data-table'
import { createSnackbarQueue, SnackbarQueue } from '@rmwc/snackbar'

import {
    PenaltyListResponse,
    PenaltyResponse,
    PenaltyResponseOne,
    PID,
} from '../../scheme/api/penalty'
import { Permission, token } from '../../scheme/api/auth'
import { BrIfMobile, fetchAPI, focusNextInput, SearchUser } from '../util'
import { Grid, GridCell, GridRow } from '@rmwc/grid'
import { TextField } from '@rmwc/textfield'
import { Select } from '@rmwc/select'
import { UID, UserInfo } from '../../scheme/user'
import { dateToString } from '../../scheme/time'
import { IconButton } from '@rmwc/icon-button'
import Table from '../util/table'
import { uuid } from '../../backend/util/random'

interface PenaltyProps {
    data: token
}

interface PenaltyState {
    data?: PenaltyResponse
    listData?: PenaltyListResponse
    loaded: boolean
    loadedList: boolean
    uid?: UID
    type?: string
    score?: string
    reason?: string
    refreshToken?: string
}

function penaltyFormatter(el: PenaltyResponseOne) {
    return (
        <DataTableRow>
            <DataTableCell>
                {(el.score > 0 ? '상점 ' : '벌점 ') + Math.abs(el.score) + '점'}
            </DataTableCell>
            <DataTableCell>{dateToString(el.time)}</DataTableCell>
            <DataTableCell>{el.target.name}</DataTableCell>
            <DataTableCell>{el.teacher.name}</DataTableCell>
            <DataTableCell>{el.info}</DataTableCell>
            <DataTableCell>
                <IconButton
                    icon='delete'
                    onClick={() => {
                        this.remove(el.pid)
                    }}
                />
            </DataTableCell>
        </DataTableRow>
    )
}

class Penalty extends React.Component<PenaltyProps, PenaltyState> {
    messages: any
    notify: any

    constructor(props: PenaltyProps) {
        super(props)
        let qu = createSnackbarQueue()
        this.messages = qu.messages
        this.notify = qu.notify

        this.state = {
            type: 'm',
            loaded: false,
            loadedList: false,
        }
        this.handleChange = this.handleChange.bind(this)
    }

    public handleChange(e: React.FormEvent<HTMLInputElement>, target: string) {
        // @ts-ignore
        this.setState({ [target]: e.target.value })
    }

    public refresh() {
        if (!this.state?.uid) return
        this.setState({ loaded: false })
        fetchAPI('GET', {}, 'penalty', this.state?.uid.toString())
            .then((res: PenaltyResponse) => {
                if (res.success) {
                    this.setState({
                        loaded: true,
                        data: res,
                        refreshToken: uuid(),
                    })
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

    public give() {
        if (!this.state?.type || !this.state?.score || !this.state?.reason) {
            this.notify({
                title: <b>오류</b>,
                body: '내용을 모두 입력하세요.',
                icon: 'error_outline',
                dismissIcon: true,
            })
            return
        }
        fetchAPI(
            'POST',
            {
                uid: this.state.uid,
                score:
                    parseInt(this.state.score.replace(/-/g, '')) *
                    (this.state.type === 'a' ? 1 : -1),
                reason: this.state.reason,
            },
            'penalty'
        )
            .then((res: PenaltyResponse) => {
                if (res.success)
                    this.notify({
                        title: <b>성공!</b>,
                        body: '상벌점 부여에 성공했어요.',
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
                this.setState({ score: '', reason: '' })
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

    public remove(pid: PID) {
        fetchAPI('DELETE', {}, 'penalty', pid)
            .then((res: PenaltyResponse) => {
                if (res.success)
                    this.notify({
                        title: <b>성공!</b>,
                        body: '상벌점 삭제에 성공했어요.',
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
                this.setState({ score: '', reason: '' })
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

    public render() {
        return (
            <div>
                <Typography use='headline3'>상벌점</Typography>
                <BrIfMobile />
                <Typography use='subtitle1' style={{ marginLeft: '10px' }}>
                    학생들에게 상점/벌점을 부여할 수 있어요.
                </Typography>
                <br />
                <br />
                <Typography use='headline5'>
                    특정 학생 상벌점 조회/부여
                </Typography>
                <br />
                <Grid>
                    <GridRow>
                        <GridCell desktop={8} tablet={8} phone={4}>
                            <SearchUser
                                onKeyDown={(e: any) => {
                                    if (e.key === 'Enter') focusNextInput()
                                }}
                                label='학생 정보'
                                type={[Permission.student]}
                                onSelect={(user: UserInfo) => {
                                    this.setState({ uid: user.uid })
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
                                label='조회'
                                trailingIcon='send'
                                onClick={() => {
                                    setTimeout(() => {
                                        this.refresh()
                                    }, 0)
                                }}
                            />
                        </GridCell>
                    </GridRow>
                </Grid>
                {this.state?.data && (
                    <>
                        <Grid
                            style={{
                                marginTop:
                                    (window.innerWidth <= 760 ? '-10' : '-30') +
                                    'px',
                            }}>
                            <GridRow>
                                <GridCell desktop={2} tablet={4} phone={4}>
                                    <Select
                                        label='상/벌점'
                                        enhanced
                                        outlined
                                        options={[
                                            {
                                                label: '상점',
                                                value: 'a',
                                            },
                                            {
                                                label: '벌점',
                                                value: 'm',
                                            },
                                        ]}
                                        value={this.state.type}
                                        onChange={(e) =>
                                            this.setState({
                                                type: e.currentTarget.value,
                                            })
                                        }
                                    />
                                </GridCell>
                                <GridCell desktop={2} tablet={4} phone={4}>
                                    <TextField
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                        }}
                                        outlined
                                        label='점수'
                                        value={this.state?.score}
                                        onChange={(e) =>
                                            this.handleChange(e, 'score')
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter')
                                                focusNextInput()
                                        }}
                                    />
                                </GridCell>
                                <GridCell desktop={6} tablet={5} phone={4}>
                                    <TextField
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                        }}
                                        outlined
                                        label='사유'
                                        value={this.state?.reason}
                                        onChange={(e) =>
                                            this.handleChange(e, 'reason')
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter')
                                                focusNextInput()
                                        }}
                                    />
                                </GridCell>
                                <GridCell desktop={2} tablet={3} phone={4}>
                                    <Button
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            minHeight: '45.2px',
                                        }}
                                        outlined
                                        label='부여'
                                        trailingIcon='send'
                                        onClick={() => {
                                            setTimeout(() => {
                                                this.give()
                                            }, 0)
                                        }}
                                    />
                                </GridCell>
                            </GridRow>
                        </Grid>
                        <LinearProgress
                            progress={-this.state?.data?.data?.score / 21.0}
                            buffer={1}
                        />
                        <br />
                        <Typography use='headline4'>
                            현재{' '}
                            {this.state?.data?.data?.score > 0
                                ? '상점'
                                : '벌점'}{' '}
                            {Math.abs(this.state?.data?.data?.score)}점이에요.
                        </Typography>
                        <br />
                        <br />
                        <Typography use='headline5'>상벌점 내역</Typography>
                        <br />
                        <Table
                            apiOption={['penalty', this.state?.uid.toString()]}
                            dataHandler={penaltyFormatter}
                            cols={[
                                '받은 점수',
                                '받은 시각',
                                '받은 학생',
                                '부여한 선생님',
                                '사유',
                                '작업',
                            ]}
                            notify={this.notify}
                            listObj='history'
                            key={this.state?.refreshToken}
                            emptyMessage='상벌점 내역이 없어요!'
                        />
                        <br />
                    </>
                )}
                <br />
                <Typography use='headline5'>
                    최근 부여 상벌점(전체 학생)
                </Typography>
                <br />
                <Table
                    apiOption={['penalty', 'list']}
                    dataHandler={penaltyFormatter}
                    cols={[
                        '받은 점수',
                        '받은 시각',
                        '받은 학생',
                        '부여한 선생님',
                        '사유',
                        '작업',
                    ]}
                    notify={this.notify}
                    key={this.state?.refreshToken}
                    emptyMessage='상벌점 내역이 없어요!'
                />
                <SnackbarQueue messages={this.messages} />
            </div>
        )
    }
}

export default Penalty
