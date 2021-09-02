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
                    path='/account/list'
                    method='GET'
                    info='계정 목록을 불러와요.'
                    secure
                    signin
                    request={{
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

                <APIInfo
                    path='/account/search'
                    method='POST'
                    info='이름으로 학생/선생님을 검색합니다.'
                    secure
                    signin
                    request={{
                        props: [
                            {
                                name: 'name',
                                type: 'string',
                                info: '검색할 대상의 이름입니다.',
                            },
                            {
                                name: 'type[]',
                                type: 'enum',
                                info: '검색할 계정의 정보입니다.',
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
                        props: [
                            {
                                name: 'name',
                                type: 'string',
                                info: '검색한 대상의 이름입니다.',
                            },
                            {
                                name: 'uid',
                                type: 'UUID',
                                info: '검색한 대상의 unique id입니다.',
                            },
                        ],
                        isArray: true,
                    }}
                />
            </>
        )
    }
}

export default withRouter(OpenAPIAccount)
