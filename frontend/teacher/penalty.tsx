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
import { Permission, token } from '../../scheme/api/auth'
import { BrIfMobile, fetchAPI, focusNextInput, SearchUser } from '../util'
import { Grid, GridCell, GridRow } from '@rmwc/grid'
import { TextField } from '@rmwc/textfield'
import { Select } from '@rmwc/select'
import { UserInfo } from '../../scheme/user'

interface PenaltyProps {
    data: token
}

interface PenaltyState {
    data?: PenaltyResponse
    loaded: boolean
    uid?: number
    type?: string
    score?: string
    reason?: string
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
        }
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
        if (!this.state?.uid) return
        this.setState({ loaded: false })
        fetchAPI('GET', {}, 'penalty', 'list', this.state?.uid.toString()).then(
            (res: PenaltyResponse) => {
                if (res.success) {
                    this.setState({ loaded: true, data: res })
                }
            }
        )
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

    public render() {
        let tableBody
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
                    학생들에게 상점/벌점을 부여할 수 있어요.
                </Typography>
                <br />
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
                {this.state?.data ? (
                    <>
                        <Grid style={{ marginTop: '-30px' }}>
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
                                        <DataTableHeadCell>
                                            받은 점수
                                        </DataTableHeadCell>
                                        <DataTableHeadCell>
                                            받은 시간
                                        </DataTableHeadCell>
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
                    </>
                ) : (
                    <></>
                )}
                <SnackbarQueue messages={this.messages} />
            </div>
        )
    }
}

export default Penalty
