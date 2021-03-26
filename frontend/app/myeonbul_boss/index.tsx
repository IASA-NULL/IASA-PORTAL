import * as React from 'react'
import { Typography } from '@rmwc/typography'
import { Button } from '@rmwc/button'
import { Checkbox } from '@rmwc/checkbox'
import { token } from '../../../scheme/api/auth'
import {
    MyeonbulDB,
    MyeonbulQuery,
    MyeonbulRequestListType,
    MyeonbulResponseType,
} from '../../../scheme/api/myeonbul'
import {
    DataTable,
    DataTableBody,
    DataTableCell,
    DataTableContent,
    DataTableHead,
    DataTableHeadCell,
    DataTableRow,
} from '@rmwc/data-table'
import { fetchAPI } from '../../util'
import { formatTimeD } from '../../../scheme/time'

interface Props {
    data: token
}

interface State {
    loaded: boolean
    show1: boolean
    show2: boolean
    show3: boolean
    all: boolean
    todayMyeonbulData?: MyeonbulQuery
    zoom: number
}

class MyeonbulBoss extends React.Component<Props, State> {
    public constructor(props: Props) {
        super(props)
        this.state = {
            show1: true,
            show2: true,
            show3: true,
            all: false,
            loaded: false,
            zoom: window.innerWidth * 0.0011,
        }
        window.addEventListener('resize', () => {
            this.setState({ zoom: window.innerWidth * 0.0011 })
        })
        this.refresh()
    }

    public print() {
        window.print()
    }

    public refresh() {
        this.setState({ loaded: false })
        fetchAPI(
            'POST',
            {
                type: MyeonbulRequestListType.listByDate,
            },
            'myeonbul',
            'list'
        ).then((res: MyeonbulQuery) => {
            if (res.success) {
                this.setState({ loaded: true, todayMyeonbulData: res })
            }
        })
    }

    public render() {
        let myeonbulTableBody, listTableBody
        if (this.state?.loaded) {
            try {
                myeonbulTableBody = this.state.todayMyeonbulData.data
                    .map((el: MyeonbulDB) => {
                        try {
                            if (el.approved !== MyeonbulResponseType.ACCEPT)
                                return undefined
                            let formattedDate: string,
                                begin = new Date(el.timeRange.begin),
                                end = new Date(el.timeRange.end)
                            if (el.timeRange.nickname)
                                formattedDate = el.timeRange.nickname
                            else if (begin.getDay() === end.getDay())
                                formattedDate = `${formatTimeD(
                                    begin
                                )} - ${formatTimeD(end)}`
                            else
                                formattedDate = `${begin.getFullYear()}/${
                                    begin.getMonth() + 1
                                }/${begin.getDate()} ${formatTimeD(
                                    begin
                                )} - ${end.getFullYear()}/${
                                    end.getMonth() + 1
                                }/${end.getDate()} ${formatTimeD(end)}`
                            return (
                                <DataTableRow style={{ height: '35px' }}>
                                    <DataTableCell style={{ height: '35px' }}>
                                        {el.target.name}
                                    </DataTableCell>
                                    <DataTableCell style={{ height: '35px' }}>
                                        {formattedDate}
                                    </DataTableCell>
                                    <DataTableCell style={{ height: '35px' }}>
                                        {el.place}
                                    </DataTableCell>
                                    <DataTableCell style={{ height: '35px' }}>
                                        {el.teacher.name}
                                    </DataTableCell>
                                    <DataTableCell style={{ height: '35px' }}>
                                        {el.reason}
                                    </DataTableCell>
                                    <DataTableCell style={{ height: '35px' }}>
                                        {' '}
                                    </DataTableCell>
                                </DataTableRow>
                            )
                        } catch (e) {
                            return null
                        }
                    })
                    .filter((x) => x)
            } catch (e) {}
            if (!myeonbulTableBody || myeonbulTableBody.length === 0) {
                let message
                try {
                    message = this.state.todayMyeonbulData.message
                } catch (e) {}
                if (!message) message = '면불 내역이 없어요!'
                myeonbulTableBody = (
                    <DataTableRow>
                        <DataTableCell>
                            <div>{message}</div>
                        </DataTableCell>
                        <DataTableCell />
                        <DataTableCell />
                        <DataTableCell />
                        <DataTableCell />
                        <DataTableCell />
                    </DataTableRow>
                )
            }
        } else
            myeonbulTableBody = (
                <DataTableRow>
                    <DataTableCell>
                        <div>로딩 중...</div>
                    </DataTableCell>
                    <DataTableCell />
                    <DataTableCell />
                    <DataTableCell />
                    <DataTableCell />
                    <DataTableCell />
                </DataTableRow>
            )

        return (
            <>
                <div className='no-print'>
                    <Button onClick={this.print} style={{ width: '100%' }}>
                        출력하기
                    </Button>
                    <hr style={{ margin: '0' }} />
                    <div
                        style={{
                            width: '100%',
                            textAlign: 'center',
                            display: 'none',
                        }}>
                        <div>
                            <Checkbox
                                label='1학년'
                                style={{ margin: '0 10px' }}
                                checked={this.state?.show1}
                                onChange={(evt) =>
                                    this.setState({
                                        show1: !!evt.currentTarget.checked,
                                    })
                                }
                            />
                            <Checkbox
                                label='2학년'
                                style={{ margin: '0 10px' }}
                                checked={this.state?.show2}
                                onChange={(evt) =>
                                    this.setState({
                                        show2: !!evt.currentTarget.checked,
                                    })
                                }
                            />
                            <Checkbox
                                label='3학년'
                                style={{ margin: '0 10px' }}
                                checked={this.state?.show3}
                                onChange={(evt) =>
                                    this.setState({
                                        show3: !!evt.currentTarget.checked,
                                    })
                                }
                            />
                            <Checkbox
                                label='전체 체크리스트'
                                style={{ margin: '0 10px' }}
                                checked={this.state?.all}
                                onChange={(evt) =>
                                    this.setState({
                                        all: !!evt.currentTarget.checked,
                                    })
                                }
                            />
                        </div>
                    </div>
                    <hr style={{ margin: '0', display: 'none' }} />
                </div>
                <div style={{ margin: '40px', zoom: this.state.zoom }}>
                    <div style={{ width: '220mm' }} className='init_zoom_print'>
                        <Typography use='headline3'>면불대장</Typography>
                        <Typography
                            use='subtitle1'
                            style={{ marginLeft: '10px' }}>
                            {new Date().getFullYear()}년{' '}
                            {new Date().getMonth() + 1}월 {new Date().getDate()}
                            일
                        </Typography>
                        <Typography use='caption' style={{ float: 'right' }}>
                            {new Date().toString()}, {this.props.data.name}
                        </Typography>
                        <br />
                        <hr />
                        <Typography use='headline4'>오늘 면불</Typography>
                        <br />
                        <br />
                        <DataTable
                            stickyRows={1}
                            stickyColumns={0}
                            style={{
                                width: '100%',
                            }}>
                            <DataTableContent>
                                <DataTableHead style={{ height: '35px' }}>
                                    <DataTableRow>
                                        <DataTableHeadCell
                                            style={{ height: '35px' }}>
                                            학생 이름
                                        </DataTableHeadCell>
                                        <DataTableHeadCell
                                            style={{ height: '35px' }}>
                                            면불 시간
                                        </DataTableHeadCell>
                                        <DataTableHeadCell
                                            style={{ height: '35px' }}>
                                            면불 장소
                                        </DataTableHeadCell>
                                        <DataTableHeadCell
                                            style={{ height: '35px' }}>
                                            담당 선생님
                                        </DataTableHeadCell>
                                        <DataTableHeadCell
                                            style={{ height: '35px' }}>
                                            면불 사유
                                        </DataTableHeadCell>
                                        <DataTableHeadCell
                                            alignEnd
                                            style={{ height: '35px' }}>
                                            체크
                                        </DataTableHeadCell>
                                    </DataTableRow>
                                </DataTableHead>
                                <DataTableBody>
                                    {myeonbulTableBody}
                                </DataTableBody>
                            </DataTableContent>
                        </DataTable>
                        {this.state?.all ? (
                            <>
                                <br />
                                <br />
                                <Typography use='headline4'>
                                    전체 학생 체크리스트
                                </Typography>
                                <br />
                                <br />
                                <DataTable
                                    stickyRows={1}
                                    stickyColumns={0}
                                    style={{
                                        width: '100%',
                                    }}>
                                    <DataTableContent>
                                        <DataTableHead
                                            style={{ height: '35px' }}>
                                            <DataTableRow>
                                                <DataTableHeadCell
                                                    style={{ height: '35px' }}>
                                                    이름
                                                </DataTableHeadCell>
                                                <DataTableHeadCell
                                                    style={{ height: '35px' }}>
                                                    면학 1차
                                                </DataTableHeadCell>
                                                <DataTableHeadCell
                                                    style={{ height: '35px' }}>
                                                    면학 2차
                                                </DataTableHeadCell>
                                            </DataTableRow>
                                        </DataTableHead>
                                        <DataTableBody>
                                            {listTableBody}
                                        </DataTableBody>
                                    </DataTableContent>
                                </DataTable>
                            </>
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
            </>
        )
    }
}

export default MyeonbulBoss
