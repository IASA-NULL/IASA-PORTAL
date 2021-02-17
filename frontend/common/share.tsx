import * as React from 'react'
import { withRouter } from 'react-router-dom'

import { Button } from '@rmwc/button'
import { Typography } from '@rmwc/typography'
import { BrIfMobile } from '../util'

class Share extends React.Component<any, {}> {
    public toMain() {
        this.props.history.push('/')
    }

    public render() {
        return (
            <>
                <Typography use='headline3'>개발 중...</Typography>
                <BrIfMobile />
                <Typography use='subtitle1' style={{ marginLeft: '10px' }}>
                    곧 찾아올테니 조금만 기다려주세요!
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

export default withRouter(Share)
