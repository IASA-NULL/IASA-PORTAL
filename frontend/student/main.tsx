import * as React from 'react'
import { withRouter } from 'react-router-dom'

import { Button } from '@rmwc/button'
import { Typography } from '@rmwc/typography'
import { BrIfMobile } from '../util'

class Main extends React.Component<any, {}> {
    public toMain() {
        this.props.history.push('/')
    }

    public render() {
        return (
            <>
                <Typography use='headline3'>
                    IASA PORTAL에 오신 것을 환영합니다!
                </Typography>
                <br />
                <Typography use='subtitle1' style={{ marginLeft: '10px' }}>
                    왼쪽의 링크를 눌러서 작업을 시작하세요!
                </Typography>
            </>
        )
    }
}

export default withRouter(Main)
