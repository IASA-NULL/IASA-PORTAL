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

    public handleClick() {
        this.props.history.push('/counter')
    }

    public render() {
        return (
            <>
                <Typography use={'headline1'}>404</Typography>
                <Button onClick={this.handleClick.bind(this)} outlined>메인으로</Button>
            </>
        )
    }
}

export default withRouter(NotFound)
