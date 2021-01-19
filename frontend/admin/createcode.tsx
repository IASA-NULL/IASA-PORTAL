import * as React from 'react'
import {RouteComponentProps, withRouter} from "react-router-dom"

import {Button} from '@rmwc/button'
import {Typography} from '@rmwc/typography'
import {Select} from '@rmwc/select'

import {BrIfMobile} from "../util"
import {createSnackbarQueue, SnackbarQueue} from "@rmwc/snackbar"
import createURL from "../../scheme/url"


interface IState {
    yearList: string[],
    selectedYear: string
}

class NotFound extends React.Component<any, IState> {
    messages: any
    notify: any

    constructor(props: RouteComponentProps) {
        super(props)
        let qu = createSnackbarQueue()
        this.messages = qu.messages
        this.notify = qu.notify
        this.update = this.update.bind(this)

        let year = new Date().getFullYear()
        setTimeout(() => {
            this.setState({yearList: [(year - 1).toString(), (year).toString(), (year + 1).toString()]})
        }, 0)
    }

    public update() {

    }

    public render() {
        return (
            <>
                <Typography use="headline3">가입 코드 발급</Typography>
                <BrIfMobile/>
                <Typography use="subtitle1" style={{marginLeft: '10px'}}>사용자가 가입할 수 있도록 코드를 발급해요.</Typography>
                <br/>
                <br/>
                <br/>
                <Select label="등록 학년도 선택" outlined enhanced options={this.state?.yearList || ['로드 중...']}
                        onChange={(e) => this.setState({selectedYear: e.currentTarget.value})}/>
                <br/>
                <Button onClick={this.update} outlined>발급</Button>
                <SnackbarQueue messages={this.messages}/>
            </>
        )
    }
}

export default withRouter(NotFound)
