import * as React from 'react'

import { Typography } from '@rmwc/typography'
import { LinearProgress } from '@rmwc/linear-progress'
import { DataTableRow, DataTableCell } from '@rmwc/data-table'
import { createSnackbarQueue, SnackbarQueue } from '@rmwc/snackbar'

import { PenaltyResponse, PenaltyResponseOne } from '../../scheme/api/penalty'
import { token } from '../../scheme/api/auth'
import { BrIfMobile, fetchAPI } from '../util'
import { dateToString } from '../../scheme/time'
import Table from '../util/table'

interface PenaltyProps {
    data: token
}

interface PenaltyState {
    score: number
    loaded: boolean
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
        this.setState({ loaded: false })
        fetchAPI('GET', {}, 'penalty')
            .then((res: PenaltyResponse) => {
                if (res.success) {
                    this.setState({ loaded: true, score: res.data.score })
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

    public render() {
        let message: string
        if (this.state?.score >= 0) message = '잘하고 있어요!'
        else if (this.state?.score > -5)
            message = '벌점을 받지 않도록 노력해봐요.'
        else if (this.state?.score > -10)
            message = '벌점을 받지 않도록 주의하세요.'
        else if (this.state?.score > -15)
            message = '벌점을 더 받으면 교내봉사를 해야 해요.'
        else if (this.state?.score > -21)
            message = '벌점을 더 받으면 기숙사에서 퇴소될 수 있어요!'
        else message = '저런...'
        return (
            <div>
                <Typography use='headline3'>상벌점</Typography>
                <BrIfMobile />
                <Typography use='subtitle1' style={{ marginLeft: '10px' }}>
                    받은 상벌점을 확인할 수 있어요.
                </Typography>
                <br />
                <br />
                <LinearProgress
                    progress={-this.state?.score / 21.0}
                    buffer={1}
                />
                <br />
                {this.state?.loaded ? (
                    <>
                        <Typography use='headline4'>
                            현재 {this.state?.score > 0 ? '상점' : '벌점'}{' '}
                            {Math.abs(this.state?.score)}점이에요.
                        </Typography>
                        <br />
                        <Typography use='subtitle1'>{message}</Typography>
                    </>
                ) : (
                    <Typography use='headline4'>불러오는 중...</Typography>
                )}

                <br />
                <br />
                <Typography use='headline5'>상벌점 내역</Typography>
                <br />
                <Table
                    apiOption={['penalty']}
                    dataHandler={(el: PenaltyResponseOne) => {
                        return (
                            <DataTableRow>
                                <DataTableCell>
                                    {(el.score > 0 ? '상점 ' : '벌점 ') +
                                        Math.abs(el.score) +
                                        '점'}
                                </DataTableCell>
                                <DataTableCell>
                                    {dateToString(el.time)}
                                </DataTableCell>
                                <DataTableCell>{el.teacher.name}</DataTableCell>
                                <DataTableCell>{el.info}</DataTableCell>
                            </DataTableRow>
                        )
                    }}
                    cols={['받은 점수', '받은 시각', '부여한 선생님', '사유']}
                    notify={this.notify}
                    emptyMessage='상벌점 내역이 없어요!'
                />
                <SnackbarQueue messages={this.messages} />
            </div>
        )
    }
}

export default Penalty
