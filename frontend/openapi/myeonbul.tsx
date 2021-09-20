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
                <Typography use='headline3'>면불 API</Typography>
                <BrIfMobile />
                <Typography use='subtitle1' style={{ marginLeft: '10px' }}>
                    면불에 관한 API입니다.
                </Typography>
                <br />
                <br />
                <APIInfo
                    path='/myeonbul/list'
                    method='POST'
                    info='면불 목록을 가져옵니다.'
                    secure
                    signin
                    request={{
                        props: [
                            {
                                name: 'type',
                                type: 'enum',
                                info: '가져올 목록의 유형입니다.',
                                enum_val: [
                                    {
                                        value: 0,
                                        desc: '사용자 기준',
                                    },
                                    {
                                        value: 1,
                                        desc: '날짜 기준',
                                    },
                                ],
                            },
                        ],
                    }}
                    response={{
                        props: [
                            {
                                name: 'mid',
                                type: 'UUID',
                                info: '면불 ID',
                            },
                            {
                                name: 'timeRange.begin',
                                type: 'number',
                                info: '면불이 시작하는 시각의 타임스탬프',
                            },
                            {
                                name: 'timeRange.end',
                                type: 'number',
                                info: '면불이 끝나는 시각의 타임스탬프',
                            },
                            {
                                name: 'timeRange.nickname',
                                optional: true,
                                type: 'string',
                                info: '면불 시간의 별칭(예: 면학 1차)',
                            },
                            {
                                name: 'place',
                                type: 'string',
                                info: '면불 장소',
                            },
                            {
                                name: 'reason',
                                type: 'string',
                                info: '면불 사유',
                            },
                            {
                                name: 'sid',
                                type: 'number',
                                info: '면불 신청자의 unique id',
                            },
                            {
                                name: 'tid',
                                type: 'number',
                                info: '면불 검토자의 unique id',
                            },
                            {
                                name: 'approved',
                                type: 'enum',
                                info: '승인 상태',
                                enum_val: [
                                    {
                                        value: 0,
                                        desc: '승인',
                                    },
                                    {
                                        value: 1,
                                        desc: '거절',
                                    },
                                    {
                                        value: 2,
                                        desc: '확인 안함',
                                    },
                                ],
                            },
                            {
                                name: 'target.name',
                                type: 'string',
                                info: '면불 신청자의 이름',
                            },
                            {
                                name: 'target.uid',
                                type: 'number',
                                info: '면불 신청자의 unique id',
                            },
                            {
                                name: 'target.type',
                                type: 'enum',
                                info: '면불 신청자의 계정 정보',
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
                                name: 'teacher.name',
                                type: 'string',
                                info: '면불 검토자의 이름',
                            },
                            {
                                name: 'teacher.uid',
                                type: 'number',
                                info: '면불 검토자의 unique id',
                            },
                            {
                                name: 'teacher.type',
                                type: 'enum',
                                info: '면불 검토자의 계정 정보',
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
                        isArray: true,
                    }}
                />
                <APIInfo
                    path='/myeonbul'
                    method='POST'
                    info='면불을 신청합니다.'
                    secure
                    signin
                    request={{
                        props: [
                            {
                                name: 'timeRange.begin',
                                type: 'number',
                                info: '면불이 시작하는 시각의 타임스탬프',
                            },
                            {
                                name: 'timeRange.end',
                                type: 'number',
                                info: '면불이 끝나는 시각의 타임스탬프',
                            },
                            {
                                name: 'timeRange.nickname',
                                optional: true,
                                type: 'string',
                                info: '면불 시간의 별칭(예: 면학 1차)',
                            },
                            {
                                name: 'place',
                                type: 'string',
                                info: '면불 장소',
                            },
                            {
                                name: 'reason',
                                type: 'string',
                                info: '면불 사유',
                            },
                            {
                                name: 'student',
                                type: 'number',
                                info: '대상 학생의 unique id',
                                optional: true,
                            },
                            {
                                name: 'teacher',
                                type: 'number',
                                info: '대상 검토자의 unique id',
                                optional: true,
                            },
                        ],
                    }}
                    response={{
                        props: [
                            {
                                name: 'data',
                                type: 'UUID',
                                info: '신청한 면불의 id',
                            },
                        ],
                    }}
                />
                <APIInfo
                    path='/myeonbul/:mid'
                    method='DELETE'
                    info='면불을 삭제합니다.'
                    secure
                    signin
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
                    path='/myeonbul/:mid/response'
                    method='PUT'
                    info='면불을 승인하거나 거절합니다.'
                    secure
                    signin
                    teacherOnly
                    request={{
                        props: [
                            {
                                name: 'type',
                                type: 'enum',
                                info: '승인 여부',
                                enum_val: [
                                    {
                                        value: 0,
                                        desc: '승인',
                                    },
                                    {
                                        value: 1,
                                        desc: '거절',
                                    },
                                ],
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
            </>
        )
    }
}

export default withRouter(OpenAPIAccount)
