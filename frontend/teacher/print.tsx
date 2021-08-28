import * as React from 'react'

import { Button } from '@rmwc/button'
import { Typography } from '@rmwc/typography'
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

import {
    PHID,
    PrintHistoryOne,
    PrintHistoryResponse,
} from '../../scheme/api/print'
import { token } from '../../scheme/api/auth'
import { BrIfMobile, fetchAPI } from '../util'
import {
    dateToString,
    formatTimeD,
    myeonbulTimtToString,
} from '../../scheme/time'
import { IconButton } from '@rmwc/icon-button'
import commonApi from '../../scheme/api/commonApi'
import {
    MyeonbulDB,
    MyeonbulRequestListType,
    MyeonbulResponseType,
} from '../../scheme/api/myeonbul'
import { Checkbox } from '@rmwc/checkbox'
import Table from '../util/table'
import { uuid } from '../../backend/util/random'

interface PrintProps {
    data: token
}

interface PrintState {
    data?: PrintHistoryResponse
    loaded: boolean
    refreshToken: string
}

class Print extends React.Component<PrintProps, PrintState> {
    messages: any
    notify: any

    constructor(props: PrintProps) {
        super(props)
        let qu = createSnackbarQueue()
        this.messages = qu.messages
        this.notify = qu.notify
    }

    public remove(phid: PHID) {
        fetchAPI('DELETE', {}, 'print', phid)
            .then((res: commonApi) => {
                if (res.success)
                    this.notify({
                        title: <b>성공!</b>,
                        body: '내역 삭제에 성공했어요.',
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

    public refresh() {
        this.setState({ refreshToken: uuid() })
    }

    public render() {
        return (
            <div>
                <Typography use='headline3'>프린트</Typography>
                <BrIfMobile />
                <Typography use='subtitle1' style={{ marginLeft: '10px' }}>
                    프린트 사용 명부를 확인할 수 있어요.
                </Typography>
                <br />
                <br />
                <Typography use='headline5'>출력 내역</Typography>
                <br />
                <Table
                    apiOption={['print']}
                    dataHandler={(el: PrintHistoryOne) => {
                        return (
                            <DataTableRow>
                                <DataTableCell alignEnd>{el.sid}</DataTableCell>
                                <DataTableCell>
                                    {dateToString(el.time)}
                                </DataTableCell>
                                <DataTableCell alignEnd>
                                    {el.count}
                                </DataTableCell>
                                <DataTableCell alignEnd>{el.cid}</DataTableCell>
                                <DataTableCell alignEnd>
                                    <IconButton
                                        icon='delete'
                                        onClick={() => {
                                            this.remove(el.phid)
                                        }}
                                    />
                                </DataTableCell>
                            </DataTableRow>
                        )
                    }}
                    cols={['학번', '시각', '장수', '출력 위치', '작업']}
                    notify={this.notify}
                    key={this.state?.refreshToken}
                    emptyMessage='출력 내역이 없어요!'
                />
                <SnackbarQueue messages={this.messages} />
            </div>
        )
    }
}

export default Print
