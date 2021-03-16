import * as React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'

import { Button } from '@rmwc/button'
import { Typography } from '@rmwc/typography'
import { Select } from '@rmwc/select'

import { BrIfMobile, fetchAPI, RequireSudo } from '../util'
import { createSnackbarQueue, SnackbarQueue } from '@rmwc/snackbar'
import commonApi from '../../scheme/api/commonApi'

interface IState {
    branches: string[]
    selectedBranch: string
    data: commonApi
}

class NotFound extends React.Component<any, IState> {
    messages: any
    notify: any

    constructor(props: RouteComponentProps) {
        RequireSudo()
        super(props)
        let qu = createSnackbarQueue()
        this.messages = qu.messages
        this.notify = qu.notify
        this.update = this.update.bind(this)
        this.refresh()
    }

    public refresh() {
        fetch('https://api.github.com/repos/IASA-NULL/IASA-PORTAL/branches')
            .then((res) => res.json())
            .then((res) => {
                let branches = [] as string[]
                res.forEach((br: any) => {
                    branches.push(`${br.commit.sha.substr(0, 6)} @ ${br.name}`)
                })
                this.setState({ branches: branches })
            })
        fetchAPI('GET', {}, 'admin', 'current').then((res) => {
            this.setState({ data: res })
        })
    }

    public update() {
        if (!this.state?.selectedBranch) {
            this.notify({
                title: <b>오류</b>,
                body: '브랜치를 선택하세요.',
                icon: 'error_outline',
                dismissIcon: true,
            })
            return
        }
        fetchAPI(
            'POST',
            { branch: this.state?.selectedBranch },
            'admin',
            'update'
        ).then((res) => {
            if (res.success) {
                this.notify({
                    title: <b>완료!</b>,
                    body: '곧 사이트가 새로 빌드될 거에요.',
                    icon: 'check',
                    dismissIcon: true,
                })
                window.location.reload()
            } else
                this.notify({
                    title: <b>오류</b>,
                    body: res.message,
                    icon: 'error_outline',
                    dismissIcon: true,
                })
        })
    }

    public render() {
        return (
            <>
                <Typography use='headline3'>업데이트</Typography>
                <BrIfMobile />
                <Typography use='subtitle1' style={{ marginLeft: '10px' }}>
                    깃허브에서 사이트의 새 버전을 가져와서 업데이트해요.
                </Typography>
                <br />
                <br />
                <div style={{ width: '200px' }}>
                    <Select
                        label='브랜치 선택'
                        outlined
                        enhanced
                        options={this.state?.branches || ['로드 중...']}
                        onChange={(e) =>
                            this.setState({
                                selectedBranch: e.currentTarget.value,
                            })
                        }
                    />
                </div>
                <br />
                <Button onClick={this.update} outlined>
                    업데이트
                </Button>
                <br />
                <br />
                <Typography use='headline5'>현재 버전</Typography>
                <BrIfMobile />
                <Typography use='subtitle1' style={{ marginLeft: '10px' }}>
                    현재 사이트의 버전을 나타내요.
                </Typography>
                <br />
                <br />
                <Typography use='headline6'>
                    {this.state?.data
                        ? this.state.data.success
                            ? `${this.state.data.data.head} @ ${this.state.data.data.branch}\n${this.state.data.data.message}`
                            : this.state.data.message
                        : '불러오는 중...'}
                </Typography>
                <br />
                <SnackbarQueue messages={this.messages} />
            </>
        )
    }
}

export default withRouter(NotFound)
