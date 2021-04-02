import * as React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'

import { Button } from '@rmwc/button'
import { Typography } from '@rmwc/typography'

import { BrIfMobile } from '../util'
import { createSnackbarQueue, SnackbarQueue } from '@rmwc/snackbar'
import commonApi from '../../scheme/api/commonApi'

interface IState {
    data: commonApi
}

class External extends React.Component<any, IState> {
    messages: any
    notify: any

    constructor(props: RouteComponentProps) {
        super(props)
        let qu = createSnackbarQueue()
        this.messages = qu.messages
        this.notify = qu.notify
    }

    public render() {
        return (
            <>
                <Typography use='headline3'>서비스 관리</Typography>
                <BrIfMobile />
                <Typography use='subtitle1' style={{ marginLeft: '10px' }}>
                    외부 서비스에 접속해요.
                </Typography>
                <br />
                <br />
                <Typography use='headline5'>Console</Typography>
                <BrIfMobile />
                <Typography use='subtitle1' style={{ marginLeft: '10px' }}>
                    IASA PORTAL의 Serverless Console이에요.
                </Typography>
                <br />
                <br />
                <a
                    href='https://admin.iasa.kr/'
                    target='_blank'
                    rel='noopener noreferrer'>
                    <Button outlined>Console</Button>
                </a>{' '}
                <br />
                <br />
                <Typography use='headline5'>AWS</Typography>
                <BrIfMobile />
                <Typography use='subtitle1' style={{ marginLeft: '10px' }}>
                    AWS를 관리해요.
                </Typography>
                <br />
                <br />
                <a
                    href='https://ap-northeast-2.console.aws.amazon.com/console/home?region=ap-northeast-2'
                    target='_blank'
                    rel='noopener noreferrer'>
                    <Button outlined>메인</Button>
                </a>{' '}
                <a
                    href='https://s3.console.aws.amazon.com/s3/home?region=ap-northeast-2'
                    target='_blank'
                    rel='noopener noreferrer'>
                    <Button outlined>S3</Button>
                </a>{' '}
                <a
                    href='https://console.aws.amazon.com/ses/home?region=us-east-1#verified-senders-domain:'
                    target='_blank'
                    rel='noopener noreferrer'>
                    <Button outlined>SES</Button>
                </a>{' '}
                <a
                    href='https://ap-northeast-2.console.aws.amazon.com/acm/home?region=ap-northeast-2#/'
                    target='_blank'
                    rel='noopener noreferrer'>
                    <Button outlined>Certificate Manager</Button>
                </a>{' '}
                <a
                    href='https://ap-northeast-2.console.aws.amazon.com/ec2/v2/home?region=ap-northeast-2#Instances:'
                    target='_blank'
                    rel='noopener noreferrer'>
                    <Button outlined>EC2</Button>
                </a>{' '}
                <a
                    href='https://ap-northeast-2.console.aws.amazon.com/apigateway/main/apis?region=ap-northeast-2'
                    target='_blank'
                    rel='noopener noreferrer'>
                    <Button outlined>API Gateway</Button>
                </a>{' '}
                <a
                    href='https://ap-northeast-2.console.aws.amazon.com/lambda/home?region=ap-northeast-2#/functions'
                    target='_blank'
                    rel='noopener noreferrer'>
                    <Button outlined>Lambda</Button>
                </a>{' '}
                <br />
                <br />
                <Typography use='headline5'>도메인</Typography>
                <BrIfMobile />
                <Typography use='subtitle1' style={{ marginLeft: '10px' }}>
                    도메인을 관리해요.
                </Typography>
                <br />
                <br />
                <a
                    href='https://www.hosting.kr/'
                    target='_blank'
                    rel='noopener noreferrer'>
                    <Button outlined>호스팅케이알</Button>
                </a>{' '}
                <br />
                <br />
                <Typography use='headline5'>CloudFlare</Typography>
                <BrIfMobile />
                <Typography use='subtitle1' style={{ marginLeft: '10px' }}>
                    클라우드플레어 서비스를 관리해요.
                </Typography>
                <br />
                <br />
                <a
                    href='https://dash.cloudflare.com/'
                    target='_blank'
                    rel='noopener noreferrer'>
                    <Button outlined>CloudFlare</Button>
                </a>{' '}
                <br />
                <br />
                <Typography use='headline5'>라이브러리</Typography>
                <BrIfMobile />
                <Typography use='subtitle1' style={{ marginLeft: '10px' }}>
                    사용한 라이브러리들의 홈페이지에요.
                </Typography>
                <br />
                <br />
                <a
                    href='https://rmwc.io/'
                    target='_blank'
                    rel='noopener noreferrer'>
                    <Button outlined>rmwc</Button>
                </a>{' '}
                <a
                    href='https://material.io/resources/icons/'
                    target='_blank'
                    rel='noopener noreferrer'>
                    <Button outlined>Material Icons</Button>
                </a>{' '}
                <SnackbarQueue messages={this.messages} />
            </>
        )
    }
}

export default withRouter(External)
