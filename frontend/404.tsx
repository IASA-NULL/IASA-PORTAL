import * as React from 'react'
import {RouteComponentProps, withRouter} from "react-router-dom"

import {Button} from '@rmwc/button'
import {Typography} from '@rmwc/typography'

import '@rmwc/button/styles'
import '@rmwc/typography/styles'


class NotFound extends React.Component<any, {}> {
    constructor(props: RouteComponentProps) {
        super(props)
    }

    public toMain() {
        this.props.history.push('/')
    }

    public render() {
        return (
            <>
                <Typography use="headline3">404</Typography>
                <Typography use="subtitle1" style={{marginLeft: '10px'}}>페이지를 찾을 수 없어요 :(</Typography>
                <br/>
                <br/>
                <Button onClick={this.toMain.bind(this)} outlined>메인으로</Button>
            </>
        )
    }
}

export default withRouter(NotFound)
