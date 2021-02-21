import * as React from 'react'
import { withRouter } from 'react-router-dom'

import { Typography } from '@rmwc/typography'
import { BrIfMobile } from '../util'
import {
    Card,
    CardPrimaryAction,
    CardMedia,
    CardActions,
    CardActionButtons,
    CardActionButton,
} from '@rmwc/card'

class OpenAPIIndex extends React.Component<any, {}> {
    public toMain() {
        this.props.history.push('/')
    }

    public render() {
        return (
            <>
                <Typography use='headline3'>OpenAPI</Typography>
                <BrIfMobile />
                <Typography use='subtitle1' style={{ marginLeft: '10px' }}>
                    IASA PORTAL의 API에 대한 명세서에요.
                </Typography>
                <br />
                <br />
                <Card style={{ width: '21rem' }}>
                    <CardPrimaryAction>
                        <CardMedia
                            sixteenByNine
                            style={{
                                backgroundImage:
                                    'url(/static/img/github-social.png)',
                            }}
                        />
                        <div style={{ padding: '0 1rem 1rem 1rem' }}>
                            <Typography use='headline6' tag='h2'>
                                GITHUB 보기
                            </Typography>
                            <Typography
                                use='body1'
                                tag='div'
                                theme='textSecondaryOnBackground'>
                                이 사이트의 소스코드를 확인할 수 있어요.
                            </Typography>
                        </div>
                    </CardPrimaryAction>
                    <CardActions>
                        <CardActionButtons>
                            <a
                                href='https://github.com/IASA-Null/IASA-PORTAL'
                                target='_blank'
                                rel='noreferer'>
                                <CardActionButton>깃허브 열기</CardActionButton>
                            </a>
                        </CardActionButtons>
                    </CardActions>
                </Card>
            </>
        )
    }
}

export default withRouter(OpenAPIIndex)
