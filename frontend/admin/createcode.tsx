import * as React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'

import { Button } from '@rmwc/button'
import { Typography } from '@rmwc/typography'
import { Select } from '@rmwc/select'

import {
    BrIfMobile,
    fetchAPI,
    FileInput,
    focusNextInput,
    uploadFile,
} from '../util'
import { createSnackbarQueue, SnackbarQueue } from '@rmwc/snackbar'
import createURL from '../../scheme/url'
import { Grid, GridCell, GridRow } from '@rmwc/grid'
import { TextField } from '@rmwc/textfield'
import { Avatar } from '@rmwc/avatar'
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
import { Permission } from '../../scheme/api/auth'
import commonApi from '../../scheme/api/commonApi'

interface IState {
    selectedType: string
    name: string
    code: string
    showDialog: boolean
    data: any
    loaded: boolean
}

class CreateCode extends React.Component<any, IState> {
    messages: any
    notify: any
    fileList: FileList

    constructor(props: RouteComponentProps) {
        super(props)
        let qu = createSnackbarQueue()
        this.messages = qu.messages
        this.notify = qu.notify
        this.refresh()
    }

    public create() {
        if (this.fileList && this.fileList.length) {
            const data = new FormData()

            for (const file of this.fileList) {
                data.append('files[]', file, file.name)
            }

            uploadFile(data).then((res) => {
                if (res.success) {
                    fetchAPI(
                        'PUT',
                        {
                            avatar: res.data.fileList[0],
                            name: this.state?.name,
                            type: this.state?.selectedType[0],
                            year:
                                new Date().getFullYear() -
                                parseInt(this.state?.selectedType[1]) +
                                1,
                        },
                        'admin',
                        'code'
                    )
                        .then((res) => {
                            if (res.success) {
                                this.setState({
                                    showDialog: true,
                                    code: res.data.code,
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
            })
        } else {
            fetchAPI(
                'PUT',
                {
                    name: this.state?.name,
                    type: this.state?.selectedType[0],
                    year:
                        new Date().getFullYear() -
                        parseInt(this.state?.selectedType[1]) +
                        1,
                },
                'admin',
                'code'
            )
                .then((res) => {
                    if (res.success) {
                        this.setState({
                            showDialog: true,
                            code: res.data.code,
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
    }

    public handleChange(e: React.FormEvent<HTMLInputElement>, target: string) {
        // @ts-ignore
        this.setState({ [target]: e.target.value })
    }

    public refresh() {
        this.setState({ loaded: false })
        fetchAPI('GET', {}, 'admin', 'code').then((res: commonApi) => {
            this.setState({ loaded: true, data: res })
        })
    }

    public render() {
        let tableBody
        if (this.state?.loaded) {
            try {
                tableBody = this.state.data.data.codeList
                    .map((el: any) => {
                        try {
                            return (
                                <DataTableRow>
                                    <DataTableCell>
                                        {el.type === Permission.student
                                            ? '학생'
                                            : '선생님'}
                                    </DataTableCell>
                                    <DataTableCell>
                                        {el.uid.substr(0, 4)}
                                    </DataTableCell>
                                    <DataTableCell>{el.name}</DataTableCell>
                                    <DataTableCell>
                                        <Avatar
                                            src={createURL(
                                                'api',
                                                'files',
                                                'download',
                                                el.avatar
                                            )}
                                            size='large'
                                        />
                                    </DataTableCell>
                                    <DataTableCell>{el.code}</DataTableCell>
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
                if (!message) message = '발급된 코드가 없어요!'
                tableBody = (
                    <DataTableRow>
                        <DataTableCell>
                            <div>{message}</div>
                        </DataTableCell>
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
                </DataTableRow>
            )
        return (
            <>
                <Typography use='headline3'>가입 코드 발급</Typography>
                <BrIfMobile />
                <Typography use='subtitle1' style={{ marginLeft: '10px' }}>
                    사용자가 가입할 수 있도록 코드를 발급해요.
                </Typography>
                <br />
                <br />
                <Grid>
                    <GridRow>
                        <GridCell desktop={4} tablet={4} phone={4}>
                            <Select
                                label='종류 선택'
                                outlined
                                enhanced
                                options={[
                                    {
                                        label: '1학년',
                                        value: 'S1',
                                    },
                                    {
                                        label: '2학년',
                                        value: 'S2',
                                    },
                                    {
                                        label: '3학년',
                                        value: 'S3',
                                    },
                                    {
                                        label: '선생님',
                                        value: 'T1',
                                    },
                                ]}
                                onChange={(e) =>
                                    this.setState({
                                        selectedType: e.currentTarget.value,
                                    })
                                }
                            />
                        </GridCell>
                        <GridCell desktop={3} tablet={4} phone={4}>
                            <TextField
                                style={{ width: '100%', height: '100%' }}
                                outlined
                                label='이름'
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') focusNextInput()
                                }}
                                onChange={(e) => this.handleChange(e, 'name')}
                            />
                        </GridCell>
                        <GridCell desktop={3} tablet={4} phone={4}>
                            <FileInput
                                style={{ width: '100%', height: '100%' }}
                                outlined
                                label='사진'
                                accept='image/*'
                                onKeyDown={(e: KeyboardEvent) => {
                                    if (e.key === 'Enter') focusNextInput()
                                }}
                                onFileSelect={(files: FileList) => {
                                    this.fileList = files
                                }}
                            />
                        </GridCell>

                        <GridCell desktop={2} tablet={8} phone={4}>
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
                <Typography use='headline5'>사용되지 않은 코드</Typography>
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
                                <DataTableHeadCell>계정 종류</DataTableHeadCell>
                                <DataTableHeadCell>연도</DataTableHeadCell>
                                <DataTableHeadCell>이름</DataTableHeadCell>
                                <DataTableHeadCell>사진</DataTableHeadCell>
                                <DataTableHeadCell>코드</DataTableHeadCell>
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
                    <DialogTitle>코드가 생성됐어요!</DialogTitle>
                    <DialogContent>
                        <Typography use='headline5'>
                            {this.state?.code}
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

export default withRouter(CreateCode)
