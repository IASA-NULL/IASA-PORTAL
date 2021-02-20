import * as React from 'react'
import { withRouter } from 'react-router-dom'

import { Typography } from '@rmwc/typography'
import { BrIfMobile } from '../util'
import { APIInfo } from './component'

class OpenAPIAccount extends React.Component<any, {}> {
    public toMain() {
        this.props.history.push('/')
    }

    public render() {
        return (
            <>
                <Typography use='headline3'>계정 API</Typography>
                <BrIfMobile />
                <Typography use='subtitle1' style={{ marginLeft: '10px' }}>
                    계정에 관한 API입니다.
                </Typography>
                <br />
                <br />
                <APIInfo
                    path='/'
                    method='GET'
                    info='계정 목록을 불러와요.'
                    secure
                    signin
                    request={{
                        raw: `{
    type: number
}`,
                        props: [
                            {
                                name: 'type',
                                type: 'enum',
                                info: '조회할 종류를 선택합니다.',
                                enum_val: [
                                    {
                                        value: 2,
                                        desc: '학생',
                                    },
                                    {
                                        value: 3,
                                        desc: '선생님',
                                    },
                                ],
                            },
                        ],
                    }}
                    response={{
                        raw: `data: {
    name: string,
    uid: number
}[]`,
                        props: [
                            {
                                name: 'name',
                                type: 'string',
                                info: '유저의 이름',
                            },
                            {
                                name: 'uid',
                                type: 'number',
                                info: '유저의 unique ID',
                            },
                        ],
                    }}
                />
            </>
        )
    }
}

export default withRouter(OpenAPIAccount)
