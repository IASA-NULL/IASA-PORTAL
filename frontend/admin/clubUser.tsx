import * as React from 'react'
import { withRouter } from 'react-router-dom'

import { Button } from '@rmwc/button'
import { Typography } from '@rmwc/typography'
import { Select } from '@rmwc/select'

import { BrIfMobile, fetchAPI, focusNextInput } from '../util'
import { createSnackbarQueue, SnackbarQueue } from '@rmwc/snackbar'
import { Grid, GridCell, GridRow } from '@rmwc/grid'
import { TextField } from '@rmwc/textfield'
import {
    DataTable,
    DataTableBody,
    DataTableCell,
    DataTableContent,
    DataTableHead,
    DataTableHeadCell,
    DataTableRow,
} from '@rmwc/data-table'
import { IconButton } from '@rmwc/icon-button'

let qu = createSnackbarQueue()
let messages = qu.messages
let notify = qu.notify

function refresh() {
    fetchAPI('GET', {}, 'clubPerson', 'checkPerson')
        .then((res) => {
            if (res.success) {
                return true
            } else {
                notify({
                    title: <b>오류</b>,
                    body: res.message,
                    icon: 'error_outline',
                    dismissIcon: true,
                })
            }
        })
        .catch(() => {
            notify({
                title: <b>오류</b>,
                body: '서버와 연결할 수 없어요.',
                icon: 'error_outline',
                dismissIcon: true,
            })
        })
    return false
}

function remove(number: string) {
    fetchAPI('DELETE', {}, 'clubPerson', 'person', number)
        .then((res) => {
            if (res.success) {
                notify({
                    title: <b>성공!</b>,
                    body: '정상적으로 삭제했어요.',
                    icon: 'check',
                    dismissIcon: true,
                })
            } else
                notify({
                    title: <b>오류</b>,
                    body: res.message,
                    icon: 'error_outline',
                    dismissIcon: true,
                })
            refresh()
        })
        .catch(() => {
            notify({
                title: <b>오류</b>,
                body: '서버와 연결할 수 없어요.',
                icon: 'error_outline',
                dismissIcon: true,
            })
        })
}

function About() {
    const [check, setCheck] = React.useState(0)

    const TableBody = () => {
        const [table, setTable] = React.useState([])
        React.useEffect(() => {
            fetchAPI('GET', {}, 'clubPerson', 'person').then((res: any) => {
                setTable(res.data)
            })
        }, [check])

        if (!table || table.length === 0) {
            let message = '신청한 인원이 없어요!'
            return (
                <DataTableRow>
                    <DataTableCell>
                        <div>{message}</div>
                    </DataTableCell>
                    <DataTableCell />
                    <DataTableCell />
                    <DataTableCell />
                </DataTableRow>
            )
        } else {
            return (
                <>
                    {table &&
                        table.map((el) => (
                            <DataTableRow>
                                <DataTableCell>{el.number}</DataTableCell>
                                <DataTableCell>{el.name}</DataTableCell>
                                <DataTableCell>{el.first1[0]}</DataTableCell>
                                <DataTableCell>{el.first2[0]}</DataTableCell>
                                <DataTableCell>{el.second1[0]}</DataTableCell>
                                <DataTableCell>{el.second2[0]}</DataTableCell>
                                <DataTableCell>
                                    <IconButton
                                        icon='delete'
                                        onClick={() => {
                                            remove(el.number)
                                            setCheck(check + 1)
                                        }}
                                    />
                                </DataTableCell>
                            </DataTableRow>
                        ))}
                </>
            )
        }
    }

    return (
        <>
            <Typography use='headline5'>인원확인</Typography>
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
                            <DataTableHeadCell>학번</DataTableHeadCell>
                            <DataTableHeadCell>이름</DataTableHeadCell>
                            <DataTableHeadCell>
                                제1동아리 1지망
                            </DataTableHeadCell>
                            <DataTableHeadCell>
                                제1동아리 2지망
                            </DataTableHeadCell>
                            <DataTableHeadCell>
                                제2동아리 1지망
                            </DataTableHeadCell>
                            <DataTableHeadCell>
                                제2동아리 2지망
                            </DataTableHeadCell>
                            <DataTableHeadCell>작업</DataTableHeadCell>
                        </DataTableRow>
                    </DataTableHead>
                    <DataTableBody>
                        <TableBody />
                    </DataTableBody>
                </DataTableContent>
            </DataTable>
            <br />
            <Button
                outlined
                onClick={() => {
                    setCheck(check + 1)
                }}
                style={{ marginLeft: '20px' }}>
                새로고침
            </Button>

            <SnackbarQueue messages={messages} />
        </>
    )
}

export default withRouter(About)
