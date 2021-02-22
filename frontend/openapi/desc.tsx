import * as React from 'react'
import { withRouter } from 'react-router-dom'

import { Typography } from '@rmwc/typography'
import { BrIfMobile } from '../util'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { github } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { CodeBlock, PropInfo } from './component'

class OpenAPIDesc extends React.Component<any, {}> {
    public toMain() {
        this.props.history.push('/')
    }

    public render() {
        return (
            <>
                <Typography use='headline3'>OpenAPI 설명</Typography>
                <BrIfMobile />
                <Typography use='subtitle1' style={{ marginLeft: '10px' }}>
                    IASA PORTAL의 API의 대략적인 개요를 설명해요.
                </Typography>
                <br />
                <br />
                <Typography use='headline4'>엔드포인트</Typography>
                <p>
                    IASA PORTAL의 모든 OpenAPI는 api.iasa.kr에서 호출할 수 있습니다.
                </p>
                <br />
                <Typography use='headline4'>요청</Typography>
                <p>
                    파일 업로드를 제외한 모든 요청은 JSON 형태로 이루어집니다.
                </p>
                <br />
                <Typography use='headline4'>응답</Typography>
                <p>
                    응답 역시 항상 JSON 형태로 이루어집니다. 특히, 응답은 항상
                    아래와 같은 스키마를 만족하는 것이 보장됩니다.
                </p>
                <CodeBlock
                    code={`{
    success: boolean
    data: any
    message: string
}`}
                />
                <br />
                <PropInfo
                    name='success'
                    type='boolean'
                    info='요청이 처리에 성공했는지를 나타냅니다.'
                />
                <PropInfo
                    name='data'
                    type='any'
                    info='요청한 결과값은 항상 여기에 담겨서 표시됩니다.'
                />
                <PropInfo
                    name='message'
                    type='string'
                    info='요청이 실패했을 시 실패한 이유를 알려줍니다. 요청이 성공한 경우에는 보통 표시되지 않습니다.'
                />
            </>
        )
    }
}

export default withRouter(OpenAPIDesc)
