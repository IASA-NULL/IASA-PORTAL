import {
    DataTable,
    DataTableBody,
    DataTableCell,
    DataTableContent,
    DataTableHead,
    DataTableHeadCell,
    DataTableRow,
} from '@rmwc/data-table'
import * as React from 'react'
import { useEffect } from 'react'
import { fetchAPI } from '../util'
import commonApi from '../../scheme/api/commonApi'
import { Button } from '@rmwc/button'
import * as XLSX from 'xlsx'
import { CircularProgress } from '@rmwc/circular-progress'

export default function Table(props: {
    apiOption: { target: string[]; method: string; body: any } | string[]
    cols: string[]
    notify: any
    emptyMessage: string
    dataHandler: any
    listObj?: string
    children?: React.ReactNode
}) {
    const [loaded, setLoaded] = React.useState(false)
    const [printing, setPrinting] = React.useState(false)
    const [data, setData] = React.useState({} as commonApi['data'])
    const [rmessage, setrMessage] = React.useState('')

    let target: string[], method: string, body: any

    if (Array.isArray(props.apiOption)) {
        method = 'GET'
        body = {}
        target = props.apiOption
    } else {
        method = props.apiOption.method
        body = props.apiOption.body
        target = props.apiOption.target
    }
    const refresh = () => {
        setLoaded(false)
        fetchAPI(method, body, ...target)
            .then((res: commonApi) => {
                if (res.success) {
                    setLoaded(true)
                    if (!props.listObj) setData(res.data)
                    else setData(res.data[props.listObj])
                    setrMessage(res.message)
                } else {
                    props.notify({
                        title: <b>오류</b>,
                        body: res.message,
                        icon: 'error_outline',
                        dismissIcon: true,
                    })
                }
            })
            .catch(() => {
                props.notify({
                    title: <b>오류</b>,
                    body: '서버와 연결할 수 없어요.',
                    icon: 'error_outline',
                    dismissIcon: true,
                })
            })
    }

    const toExcel = () => {
        setPrinting(true)
        // @ts-ignore
        let wb = XLSX.utils.table_to_book(tableRef.current, { sheet: 'sheet1' })
        // @ts-ignore
        XLSX.writeFile(wb, `res_${Date.now()}.xlsx`)
        setPrinting(false)
    }

    useEffect(refresh, [])
    const tableRef = React.useRef(null)

    let tableBody
    if (loaded) {
        try {
            tableBody = data
                .map((el: any) => {
                    try {
                        return props.dataHandler(el)
                    } catch (e) {
                        return null
                    }
                })
                .filter((x: any) => x)
        } catch (e) {}
        if (!tableBody || tableBody.length === 0) {
            let message
            try {
                message = rmessage
            } catch (e) {}
            if (!message) message = props.emptyMessage
            tableBody = (
                <DataTableRow>
                    <DataTableCell>
                        <div>{message}</div>
                    </DataTableCell>
                    {props.cols.slice(1).map(() => {
                        return <DataTableHeadCell />
                    })}
                </DataTableRow>
            )
        }
    } else
        tableBody = (
            <DataTableRow>
                <DataTableCell>
                    <div>로딩 중...</div>
                </DataTableCell>
                {props.cols.slice(1).map(() => {
                    return <DataTableHeadCell />
                })}
            </DataTableRow>
        )

    return (
        <>
            <DataTable
                ref={tableRef}
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
                            {props.cols.map((i) => {
                                return (
                                    <DataTableHeadCell>{i}</DataTableHeadCell>
                                )
                            })}
                        </DataTableRow>
                    </DataTableHead>
                    <DataTableBody>{tableBody}</DataTableBody>
                </DataTableContent>
            </DataTable>
            <Button outlined onClick={refresh} style={{ marginLeft: '20px' }}>
                {loaded ? (
                    '새로고침'
                ) : (
                    <CircularProgress style={{ margin: '7px 7px 0 0' }} />
                )}
            </Button>
            <Button
                outlined
                onClick={toExcel}
                style={{ marginLeft: '20px', marginRight: '20px' }}>
                {printing || !loaded ? (
                    <CircularProgress style={{ margin: '7px 7px 0 0' }} />
                ) : (
                    '엑셀로 변환'
                )}
            </Button>
            {props.children}
        </>
    )
}
