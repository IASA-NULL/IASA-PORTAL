import * as React from 'react'

import {Button} from '@rmwc/button'
import {Typography} from '@rmwc/typography'
import {
    DataTable,
    DataTableContent,
    DataTableHead,
    DataTableRow,
    DataTableHeadCell,
    DataTableBody,
    DataTableCell
} from '@rmwc/data-table'
import {createSnackbarQueue, SnackbarQueue} from "@rmwc/snackbar"

import {PenaltyRequest, PenaltyResponse, PenaltyResponseOne} from "../../scheme/api/penalty"
import {teacher, currentTeacherList} from '../../scheme/teacher/teacher'
import teacherList from "../../scheme/teacher/2021/list"
import {token} from "../../scheme/api/auth"
import {BrIfMobile} from "../util";

interface PenaltyProps {
    data: token
}

interface PenaltyState {
    data?: PenaltyResponse,
    loaded: boolean,
    teacherSelectOpened: boolean,
    selectedTeacher: teacher,
    teacherSearch: string,
}

class Penalty extends React.Component<PenaltyProps, PenaltyState> {
    messages: any
    notify: any

    constructor(props: PenaltyProps) {
        super(props)
        let qu = createSnackbarQueue()
        this.messages = qu.messages
        this.notify = qu.notify
    }

    public componentDidMount() {
        this.refresh()
    }

    public refresh() {
        this.setState({loaded: false})

        setTimeout(() => {
            let tempData = {
                success: true,
                message: '',
                //@ts-ignore
                data: pdl
            }
            this.setState({loaded: true, data: tempData})
        }, 500)

        /*
        fetch(CreateURL('api'))
            .then(response => response.json())
            .then(response => this.setState(response))
        */
    }

    public render() {
        let tableBody
        if (this.state?.loaded) {
            try {
                tableBody = this.state.data.data.history.map((el: PenaltyResponseOne) => {
                    try {
                        let time = new Date(el.time)
                        return <DataTableRow>
                            <DataTableCell alignEnd>{el.score}</DataTableCell>
                            <DataTableCell>{`${time.getFullYear()}/${time.getMonth() + 1}/${time.getDate()} ${time.getHours()}:${time.getMinutes()}`}</DataTableCell>
                            <DataTableCell alignEnd>{el.info}</DataTableCell>
                            <DataTableCell alignEnd>{el.teacher.name}</DataTableCell>
                        </DataTableRow>
                    } catch (e) {
                        return null
                    }
                }).filter(x => x)
            } catch (e) {
            }
            if (!tableBody || tableBody.length === 0) {
                let message
                try {
                    message = this.state.data.message
                } catch (e) {
                }
                if (!message) message = '상벌점 내역이 없어요!'
                tableBody = <DataTableRow>
                    <DataTableCell>
                        <div>{message}</div>
                    </DataTableCell>
                    <DataTableCell/>
                    <DataTableCell/>
                    <DataTableCell/>
                </DataTableRow>
            }
        } else tableBody = <DataTableRow>
            <DataTableCell>
                <div>로딩 중...</div>
            </DataTableCell>
            <DataTableCell/>
            <DataTableCell/>
            <DataTableCell/>
        </DataTableRow>
        return <div>
            <Typography use="headline3">벌점</Typography>
            <BrIfMobile/>
            <Typography use="subtitle1" style={{marginLeft: '10px'}}>받은 상벌점을 확인할 수 있어요.</Typography>
            <br/>
            <br/>
            <Typography use="headline5">상벌점 내역</Typography>
            <br/>
            <br/>
            <DataTable stickyRows={1} stickyColumns={0}
                       style={{width: 'calc(100% - 40px)', margin: '20px', maxHeight: 'calc(100vh - 300px)'}}>
                <DataTableContent>
                    <DataTableHead>
                        <DataTableRow>
                            <DataTableHeadCell>받은 점수</DataTableHeadCell>
                            <DataTableHeadCell>받은 시간</DataTableHeadCell>
                            <DataTableHeadCell>부여한 선생님</DataTableHeadCell>
                            <DataTableHeadCell alignEnd>사유</DataTableHeadCell>
                        </DataTableRow>
                    </DataTableHead>
                    <DataTableBody>
                        {tableBody}
                    </DataTableBody>
                </DataTableContent>
            </DataTable>
            <br/>
            <br/>
            <Button outlined onClick={this.refresh.bind(this)} style={{marginLeft: '20px'}}>새로고침</Button>
            <SnackbarQueue messages={this.messages}/>
        </div>
    }
}

export default Penalty
