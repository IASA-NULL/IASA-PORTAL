import * as React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'

import { Button } from '@rmwc/button'
import { Typography } from '@rmwc/typography'

import { BrIfMobile, fetchAPI, focusNextInput } from '../util'
import { createSnackbarQueue, SnackbarQueue } from '@rmwc/snackbar'
import { Grid, GridCell, GridRow } from '@rmwc/grid'
import { TextField } from '@rmwc/textfield'
import {
    Dialog,
    DialogActions,
    DialogButton,
    DialogContent,
    DialogTitle,
} from '@rmwc/dialog'
import {
    DataTable,
    DataTableBody,
    DataTableCell,
    DataTableContent,
    DataTableHead,
    DataTableHeadCell,
    DataTableRow,
} from '@rmwc/data-table'
import { formatTimeD } from '../../scheme/time'
import { IconButton } from '@rmwc/icon-button'
import commonApi from '../../scheme/api/commonApi'
import { User } from '../../scheme/user'

interface IState {
    id: string
    showDialog: boolean
    data: any
    loaded: boolean
    pw: string
}

class CreateAPI extends React.Component<any, IState> {
    messages: any
    notify: any

    constructor(props: RouteComponentProps) {
        super(props)
        let qu = createSnackbarQueue()
        this.messages = qu.messages
        this.notify = qu.notify
        this.refresh()
    }

    public create() {
        fetchAPI(
            'POST',
            {
                id: this.state?.id,
            },
            'admin',
            'api'
        )
            .then((res) => {
                if (res.success) {
                    this.setState({
                        showDialog: true,
                        pw: res.data,
                    })
                    this.refresh()
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

    public handleChange(e: React.FormEvent<HTMLInputElement>, target: string) {
        // @ts-ignore
        this.setState({ [target]: e.target.value })
    }

    public refresh() {
        this.setState({ loaded: false })
        fetchAPI('GET', {}, 'admin', 'api').then((res) => {
            this.setState({ loaded: true, data: res })
        })
    }

    public remove(id: string) {
        fetchAPI('DELETE', {}, 'admin', 'api', id)
            .then((res: commonApi) => {
                if (res.success)
                    this.notify({
                        title: <b>성공!</b>,
                        body: 'API 계정 삭제에 성공했어요.',
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

    public render() {
        let tableBody
        if (this.state?.loaded) {
            try {
                tableBody = this.state.data.data
                    .map((el: User) => {
                        try {
                            let time = new Date(el.createTime)
                            return (
                                <DataTableRow>
                                    <DataTableCell>{el.id}</DataTableCell>
                                    <DataTableCell>{`${time.getFullYear()}/${
                                        time.getMonth() + 1
                                    }/${time.getDate()} ${formatTimeD(
                                        time
                                    )}`}</DataTableCell>
                                    <DataTableCell alignEnd>
                                        <IconButton
                                            icon='delete'
                                            onClick={() => {
                                                this.remove(el.id)
                                            }}
                                        />
                                    </DataTableCell>
                                </DataTableRow>
                            )
                        } catch (e) {
                            return null
                        }
                    })
                    .filter((x: any) => x)
            } catch (e) {}
            if (!tableBody || tableBody.length === 0) {
                let message
                try {
                    message = this.state.data.message
                } catch (e) {}
                if (!message) message = '발급된 계정이 없어요!'
                tableBody = (
                    <DataTableRow>
                        <DataTableCell>
                            <div>{message}</div>
                        </DataTableCell>
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
                </DataTableRow>
            )
        return (
            <>
                <Typography use='headline3'>API 계정 발급</Typography>
                <BrIfMobile />
                <Typography use='subtitle1' style={{ marginLeft: '10px' }}>
                    API용 계정을 발급해요.
                </Typography>
                <br />
                <br />
                <Grid>
                    <GridRow>
                        <GridCell desktop={8} tablet={4} phone={4}>
                            <TextField
                                style={{ width: '100%', height: '100%' }}
                                outlined
                                label='ID'
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') focusNextInput()
                                }}
                                onChange={(e) => this.handleChange(e, 'id')}
                                icon={{
                                    icon: 'api_',
                                    tabIndex: 0,
                                    strategy: 'custom',
                                    render: ({ content }) => (
                                        <div
                                            style={{
                                                margin: '12px -47px auto 10px',
                                            }}>
                                            {content}
                                        </div>
                                    ),
                                }}
                            />
                        </GridCell>

                        <GridCell desktop={4} tablet={4} phone={4}>
                            <Button
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    minHeight: '45.2px',
                                }}
                                outlined
                                label='발급'
                                trailingIcon='send'
                                onClick={this.create.bind(this)}
                            />
                        </GridCell>
                    </GridRow>
                </Grid>
                <br />
                <Typography use='headline5'>발급된 계정들</Typography>
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
                                <DataTableHeadCell>ID</DataTableHeadCell>
                                <DataTableHeadCell>생성시각</DataTableHeadCell>
                                <DataTableHeadCell>작업</DataTableHeadCell>
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

                <Dialog
                    open={this.state?.showDialog}
                    onClose={() => {
                        this.setState({ showDialog: false })
                    }}>
                    <DialogTitle>계정이 생성됐어요!</DialogTitle>
                    <DialogContent>
                        <Typography use='headline6'>비밀번호는 </Typography>
                        <Typography use='headline5'>
                            {this.state?.pw}
                        </Typography>
                        <Typography use='headline6'> 이에요.</Typography>
                        <br />
                        <Typography use='caption'>
                            비밀번호는 지금만 확인할 수 있어요!
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <DialogButton action='close'>닫기</DialogButton>
                    </DialogActions>
                </Dialog>
                <SnackbarQueue messages={this.messages} />
            </>
        )
    }
}

export default withRouter(CreateAPI)
