import * as React from 'react'
import { withRouter } from 'react-router-dom'

import { Button } from '@rmwc/button'
import { Typography } from '@rmwc/typography'
import { BrIfMobile } from '../util'

class Classroom extends React.Component<any, {}> {
    public moveToLink() {
        let clientId =
            '214248446717-fdl9qv6djmb3iim15ongcdirgioin4f6.apps.googleusercontent.com'
        let redirectUrl = 'https://api.iasa.kr/account/gsuite'
        let permissions = [
            'https://www.googleapis.com/auth/classroom.announcements',
            'https://www.googleapis.com/auth/classroom.course-work.readonly',
            'https://www.googleapis.com/auth/classroom.courseworkmaterials.readonly',
            'https://www.googleapis.com/auth/classroom.topics',
            'https://www.googleapis.com/auth/classroom.push-notifications',
        ].join(' ')
        let endpoint = `https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?client_id=${clientId}&redirect_uri=${redirectUrl}&response_type=code&scope=${permissions}&flowName=GeneralOAuthFlow`

        window.location.href = endpoint
    }

    public render() {
        return (
            <>
                <Typography use='headline3'>Google Classroom 연동</Typography>
                <BrIfMobile />
                <Typography use='subtitle1' style={{ marginLeft: '10px' }}>
                    계속하려면 G Suite 계정으로 로그인하세요.
                </Typography>
                <br />
                <br />
                <Button onClick={this.moveToLink} outlined>
                    로그인
                </Button>
            </>
        )
    }
}

export default withRouter(Classroom)
