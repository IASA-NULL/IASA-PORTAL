import * as React from 'react'
import { withRouter } from 'react-router-dom'

import { Button } from '@rmwc/button'
import { Typography } from '@rmwc/typography'
import { BrIfMobile } from '../util'

class NotFound extends React.Component<any, {}> {
    public toMain() {
        this.props.history.push('/')
    }

    public render() {
        return (
            <>
                <Typography use='headline3'>404</Typography>
                <BrIfMobile />
                <Typography use='subtitle1' style={{ marginLeft: '10px' }}>
                    페이지를 찾을 수 없어요 :(
                </Typography>
                <br />
                <br />
                <Button onClick={this.toMain.bind(this)} outlined>
                    메인으로
                </Button>
            </>
        )
    }
}

export default withRouter(NotFound)
