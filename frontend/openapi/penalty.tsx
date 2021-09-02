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
                <Typography use='headline3'>상벌점 API</Typography>
                <BrIfMobile />
                <Typography use='subtitle1' style={{ marginLeft: '10px' }}>
                    상/벌점에 관한 API입니다.
                </Typography>
                <br />
                <br />
                <APIInfo
                    path='/penalty'
                    method='GET'
                    info='현재 받은 상/벌점 정보를 불러와요.'
                    secure
                    signin
                    studentOnly
                    response={{
                        props: [
                            {
                                name: 'score',
                                type: 'number',
                                info:
                                    '현재 상/벌점, 양수는 상점이고 음수는 벌점입니다.',
                            },
                            {
                                name: 'history[].info',
                                type: 'string',
                                info: '상/벌점을 받은 이유입니다.',
                            },
                            {
                                name: 'history[].score',
                                type: 'number',
                                info: '받은 상/벌점의 양입니다.',
                            },
                            {
                                name: 'history[].time',
                                type: 'number',
                                info: '상/벌점을 받은 시간의 타임스탬프입니다.',
                            },
                            {
                                name: 'history[].target.name',
                                type: 'string',
                                info: '상/벌점을 받은 학생의 이름입니다.',
                            },
                            {
                                name: 'history[].target.type',
                                type: 'enum',
                                info: '상/벌점을 받은 학생의 계정 정보입니다.',
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
                            {
                                name: 'history[].target.uid',
                                type: 'UUID',
                                info: '상/벌점을 받은 학생의 unique id입니다.',
                            },
                            {
                                name: 'history[].teacher.name',
                                type: 'string',
                                info: '상/벌점을 부여한 선생님의 이름입니다.',
                            },
                            {
                                name: 'history[].teacher.type',
                                type: 'enum',
                                info:
                                    '상/벌점을 부여한 선생님의 계정 정보입니다.',
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
                            {
                                name: 'history[].teacher.uid',
                                type: 'UUID',
                                info:
                                    '상/벌점을 부여한 선생님의 unique id입니다.',
                            },
                            {
                                name: 'history[].pid',
                                type: 'UUID',
                                info: '받은 상/벌점을 나타내는 고유 id입니다.',
                            },
                            {
                                name: 'history[].uid',
                                type: 'UUID',
                                info: '상/벌점을 받은 학생의 unique id입니다.',
                            },
                        ],
                    }}
                />
                <APIInfo
                    path='/penalty/:uid'
                    method='GET'
                    info='특정 학생의 상/벌점 정보를 불러와요.'
                    secure
                    signin
                    teacherOnly
                    response={{
                        props: [
                            {
                                name: 'score',
                                type: 'number',
                                info:
                                    '현재 상/벌점, 양수는 상점이고 음수는 벌점입니다.',
                            },
                            {
                                name: 'history[].info',
                                type: 'string',
                                info: '상/벌점을 받은 이유입니다.',
                            },
                            {
                                name: 'history[].score',
                                type: 'number',
                                info: '받은 상/벌점의 양입니다.',
                            },
                            {
                                name: 'history[].time',
                                type: 'number',
                                info: '상/벌점을 받은 시간의 타임스탬프입니다.',
                            },
                            {
                                name: 'history[].target.name',
                                type: 'string',
                                info: '상/벌점을 받은 학생의 이름입니다.',
                            },
                            {
                                name: 'history[].target.type',
                                type: 'enum',
                                info: '상/벌점을 받은 학생의 계정 정보입니다.',
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
                            {
                                name: 'history[].target.uid',
                                type: 'UUID',
                                info: '상/벌점을 받은 학생의 unique id입니다.',
                            },
                            {
                                name: 'history[].teacher.name',
                                type: 'string',
                                info: '상/벌점을 부여한 선생님의 이름입니다.',
                            },
                            {
                                name: 'history[].teacher.type',
                                type: 'enum',
                                info:
                                    '상/벌점을 부여한 선생님의 계정 정보입니다.',
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
                            {
                                name: 'history[].teacher.uid',
                                type: 'UUID',
                                info:
                                    '상/벌점을 부여한 선생님의 unique id입니다.',
                            },
                            {
                                name: 'history[].pid',
                                type: 'UUID',
                                info: '받은 상/벌점을 나타내는 고유 id입니다.',
                            },
                            {
                                name: 'history[].uid',
                                type: 'UUID',
                                info: '상/벌점을 받은 학생의 unique id입니다.',
                            },
                        ],
                    }}
                />
                <APIInfo
                    path='/penalty/list'
                    method='GET'
                    info='최근 부여된 상/벌점 정보를 불러와요.'
                    secure
                    signin
                    teacherOnly
                    response={{
                        isArray: true,
                        props: [
                            {
                                name: 'info',
                                type: 'string',
                                info: '상/벌점을 받은 이유입니다.',
                            },
                            {
                                name: 'score',
                                type: 'number',
                                info: '받은 상/벌점의 양입니다.',
                            },
                            {
                                name: 'time',
                                type: 'number',
                                info: '상/벌점을 받은 시간의 타임스탬프입니다.',
                            },
                            {
                                name: 'target.name',
                                type: 'string',
                                info: '상/벌점을 받은 학생의 이름입니다.',
                            },
                            {
                                name: 'target.type',
                                type: 'enum',
                                info: '상/벌점을 받은 학생의 계정 정보입니다.',
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
                            {
                                name: 'target.uid',
                                type: 'UUID',
                                info: '상/벌점을 받은 학생의 unique id입니다.',
                            },
                            {
                                name: 'teacher.name',
                                type: 'string',
                                info: '상/벌점을 부여한 선생님의 이름입니다.',
                            },
                            {
                                name: 'teacher.type',
                                type: 'enum',
                                info:
                                    '상/벌점을 부여한 선생님의 계정 정보입니다.',
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
                            {
                                name: 'teacher.uid',
                                type: 'UUID',
                                info:
                                    '상/벌점을 부여한 선생님의 unique id입니다.',
                            },
                            {
                                name: 'pid',
                                type: 'UUID',
                                info: '받은 상/벌점을 나타내는 고유 id입니다.',
                            },
                            {
                                name: 'uid',
                                type: 'UUID',
                                info: '상/벌점을 받은 학생의 unique id입니다.',
                            },
                        ],
                    }}
                />
                <APIInfo
                    path='/penalty'
                    method='POST'
                    info='상/벌점을 부여합니다.'
                    secure
                    signin
                    teacherOnly
                    request={{
                        props: [
                            {
                                name: 'uid',
                                type: 'UUID',
                                info: '부여할 학생입니다.',
                            },
                            {
                                name: 'score',
                                type: 'number',
                                info: '부여할 점수입니다.',
                            },
                            {
                                name: 'reason',
                                type: 'string',
                                info: '부여 사유입니다.',
                            },
                        ],
                    }}
                    response={{
                        props: [
                            {
                                name: 'data',
                                type: 'boolean',
                                info: '성공시 true를 반환합니다.',
                            },
                        ],
                    }}
                />
                <APIInfo
                    path='/penalty/:pid'
                    method='DELETE'
                    info='특정 상/벌점 부여기록을 삭제합니다.'
                    secure
                    signin
                    teacherOnly
                    response={{
                        props: [
                            {
                                name: 'data',
                                type: 'boolean',
                                info: '성공시 true를 반환합니다.',
                            },
                        ],
                    }}
                />
            </>
        )
    }
}

export default withRouter(OpenAPIAccount)
