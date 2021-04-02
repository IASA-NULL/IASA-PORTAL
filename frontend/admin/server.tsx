import * as React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'

import { Button } from '@rmwc/button'
import { Typography } from '@rmwc/typography'
import { Select } from '@rmwc/select'

import { BrIfMobile, fetchAPI, RequireSudo } from '../util'
import { createSnackbarQueue, SnackbarQueue } from '@rmwc/snackbar'
import commonApi from '../../scheme/api/commonApi'

interface IState {
    instanceType: string
    selInstanceType: string
    editType: boolean
    data: commonApi
}

class Server extends React.Component<any, IState> {
    messages: any
    notify: any

    constructor(props: RouteComponentProps) {
        RequireSudo()
        super(props)
        let qu = createSnackbarQueue()
        this.messages = qu.messages
        this.notify = qu.notify
        this.refresh()
    }

    public refresh() {
        fetchAPI('GET', {}, 'admin', 'sl').then((res) => {
            const token = res.data
            fetch('//sl.iasa.kr/server/get/instance?token=' + token)
                .then((res) => res.json())
                .then((res) => {
                    this.setState({ instanceType: res.data })
                })
        })
    }

    public rebootInstance() {
        fetchAPI('GET', {}, 'admin', 'sl').then((res) => {
            const token = res.data
            fetch(
                '//sl.iasa.kr/server/set/state?token=' + token + '&q=restart'
            ).then((res) => {
                this.notify({
                    title: <b>완료!</b>,
                    body: '곧 인스턴스가 재부팅 될거에요.',
                    icon: 'check',
                    dismissIcon: true,
                })
                window.location.reload()
            })
        })
    }

    public setInstanceType() {
        this.setState({ editType: false })
        fetchAPI('GET', {}, 'admin', 'sl').then((res) => {
            const token = res.data
            fetch(
                '//sl.iasa.kr/server/set/instance?token=' +
                    token +
                    '&type=' +
                    this.state?.selInstanceType
            )
            setTimeout(() => {
                this.notify({
                    title: <b>완료!</b>,
                    body: '곧 인스턴스 타입이 바뀔 거에요.',
                    icon: 'check',
                    dismissIcon: true,
                })
                window.location.reload()
            }, 1000)
        })
    }

    public render() {
        return (
            <>
                <Typography use='headline3'>인스턴스 관리</Typography>
                <BrIfMobile />
                <Typography use='subtitle1' style={{ marginLeft: '10px' }}>
                    EC2 인스턴스를 관리해요.
                </Typography>
                <br />
                <br />
                <Typography use='headline5'>인스턴스 재시작</Typography>
                <BrIfMobile />
                <Typography use='subtitle1' style={{ marginLeft: '10px' }}>
                    인스턴스를 재시작해요.
                </Typography>
                <br />
                <br />
                <Button
                    onClick={() => {
                        this.rebootInstance()
                    }}
                    outlined>
                    재부팅
                </Button>
                <br />
                <br />
                <Typography use='headline5'>인스턴스 타입</Typography>
                <BrIfMobile />
                <Typography use='subtitle1' style={{ marginLeft: '10px' }}>
                    인스턴스의 종류를 결정해요.
                </Typography>
                <br />
                <br />
                {this.state?.editType ? (
                    <>
                        <div style={{ width: '200px' }}>
                            <Select
                                label='인스턴스 종류 선택'
                                outlined
                                enhanced
                                options={['t3.micro', 't3.small', 't3.medium']}
                                onChange={(e) =>
                                    this.setState({
                                        selInstanceType: e.currentTarget.value,
                                    })
                                }
                            />
                        </div>
                        <br />
                        <Button
                            onClick={() => {
                                this.setInstanceType()
                            }}
                            outlined>
                            저장
                        </Button>
                    </>
                ) : (
                    <>
                        <Typography use='headline6'>
                            {this.state?.instanceType ?? '불러오는 중...'}
                        </Typography>
                        <br />
                        <br />
                        <Button
                            onClick={() => this.setState({ editType: true })}
                            outlined>
                            변경
                        </Button>
                    </>
                )}

                <SnackbarQueue messages={this.messages} />
            </>
        )
    }
}

export default withRouter(Server)
