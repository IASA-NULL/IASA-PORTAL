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

function create(club: any) {
    fetchAPI(
        'POST',
        {
            permission: club.permission,
            name: club.name,
        },
        'club'
    )
        .then((res) => {
            if (!res.success) {
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
}

function remove(uid: string) {
    fetchAPI('DELETE', {}, 'club', uid)
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
    const [club, setClub] = React.useState({
        permission: '',
        uid: '',
        name: '',
    })

    const TableBody = () => {
        const [table, setTable] = React.useState([])
        React.useEffect(() => {
            fetchAPI('GET', {}, 'club').then((res: any) => {
                console.log(res.data)
                setTable(res.data)
            })
            console.log(table)
        }, [check])

        if (!table || table.length === 0) {
            let message = '로딩중...'
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
                    {table.map((el) => (
                        <DataTableRow>
                            <DataTableCell>
                                {el.permission === '1'
                                    ? '제1동아리'
                                    : '제2동아리'}
                            </DataTableCell>
                            <DataTableCell>{el.name}</DataTableCell>
                            <DataTableCell>{el.uid}</DataTableCell>
                            <DataTableCell>
                                <IconButton
                                    icon='delete'
                                    onClick={() => {
                                        remove(el.uid)
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
            <Typography use='headline3'>동아리 개설</Typography>
            <BrIfMobile />
            <Typography use='subtitle1' style={{ marginLeft: '10px' }}>
                동아리를 개설해요
            </Typography>
            <br />
            <br />
            <Grid>
                <GridRow>
                    <GridCell desktop={2} tablet={4} phone={4}>
                        <Select
                            label='종류 선택'
                            outlined
                            enhanced
                            options={[
                                {
                                    label: '제1동아리',
                                    value: '1',
                                },
                                {
                                    label: '제2동아리',
                                    value: '2',
                                },
                            ]}
                            onChange={(e) =>
                                setClub({
                                    ...club,
                                    permission: e.currentTarget.value,
                                })
                            }
                        />
                    </GridCell>
                    <GridCell desktop={3} tablet={4} phone={4}>
                        <TextField
                            id='name'
                            style={{ width: '100%', height: '100%' }}
                            outlined
                            label='이름'
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') focusNextInput()
                            }}
                            onChange={(e) =>
                                setClub({
                                    ...club,
                                    name: e.currentTarget.value,
                                })
                            }
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
                            label='개설'
                            trailingIcon='send'
                            onClick={() => {
                                create(club)
                                setCheck(check + 1)
                                document.getElementById('name').value = ''
                            }}
                        />
                    </GridCell>
                </GridRow>
            </Grid>
            <br />
            <Typography use='headline5'>동아리</Typography>
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
                            <DataTableHeadCell>동아리 종류</DataTableHeadCell>
                            <DataTableHeadCell>이름</DataTableHeadCell>
                            <DataTableHeadCell>비번</DataTableHeadCell>
                            <DataTableHeadCell>작업</DataTableHeadCell>
                        </DataTableRow>
                    </DataTableHead>
                    <DataTableBody>
                        <TableBody />
                    </DataTableBody>
                </DataTableContent>
            </DataTable>
            <br />
            <br />

            <SnackbarQueue messages={messages} />
        </>
    )
}

export default withRouter(About)
