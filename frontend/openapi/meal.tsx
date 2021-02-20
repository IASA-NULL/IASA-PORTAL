import * as React from 'react'
import { withRouter } from 'react-router-dom'

import { Button } from '@rmwc/button'
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
import { APIInfo } from './component'

class OpenAPIMeal extends React.Component<any, {}> {
    public toMain() {
        this.props.history.push('/')
    }

    public render() {
        return (
            <>
                <Typography use='headline3'>급식 API</Typography>
                <BrIfMobile />
                <Typography use='subtitle1' style={{ marginLeft: '10px' }}>
                    급식에 관한 API입니다.
                </Typography>
                <br />
                <br />
                <APIInfo
                    path='/'
                    method='POST'
                    info='급식 정보를 불러옵니다.'
                    request={{
                        raw: `{
    year: number,
    month: number,
    day: number,
    type: number,
}`,
                        props: [
                            {
                                name: 'year',
                                type: 'number',
                                info: '조회할 급식 정보의 연도',
                            },
                            {
                                name: 'month',
                                type: 'number',
                                info: '조회할 급식 정보의 월',
                            },
                            {
                                name: 'day',
                                type: 'number',
                                info: '조회할 급식 정보의 일',
                            },
                            {
                                name: 'type',
                                type: 'enum',
                                info: '조회할 급식 정보의 종류',
                                enum_val: [
                                    {
                                        value: 0,
                                        desc: '아침',
                                    },
                                    {
                                        value: 1,
                                        desc: '점심',
                                    },
                                    {
                                        value: 2,
                                        desc: '저녁',
                                    },
                                ],
                            },
                        ],
                    }}
                    response={{
                        raw: `{
    time: {
        year: number,
        month: number,
        day: number,
        type: number,
    }
    menu: {
        name: string,
        allergicInfo: number[]
    }[]
    image?: string
    score?: number
    kcal?: number
    origin?: {
        name: string,
        origin: string
    }[]
    energy?: {
        name: string,
        value: number,
        unit: string
    }[]
}`,
                        props: [
                            {
                                name: 'time.year',
                                type: 'number',
                                info: '조회한 급식 정보의 연도',
                            },
                            {
                                name: 'time.month',
                                type: 'number',
                                info: '조회한 급식 정보의 월',
                            },
                            {
                                name: 'time.day',
                                type: 'number',
                                info: '조회한 급식 정보의 일',
                            },
                            {
                                name: 'time.type',
                                type: 'enum',
                                info: '조회한 급식 정보의 종류',
                                enum_val: [
                                    {
                                        value: 0,
                                        desc: '아침',
                                    },
                                    {
                                        value: 1,
                                        desc: '점심',
                                    },
                                    {
                                        value: 2,
                                        desc: '저녁',
                                    },
                                ],
                            },
                            {
                                name: 'menu[].name',
                                type: 'string',
                                info: '급식 메뉴 이름',
                            },
                            {
                                name: 'menu[].allergicInfo[]',
                                type: 'enum',
                                info: '메뉴의 알레르기 정보',
                                enum_val: [
                                    {
                                        value: 1,
                                        desc: '난류',
                                    },
                                    {
                                        value: 2,
                                        desc: '우유',
                                    },
                                    {
                                        value: 3,
                                        desc: '메밀',
                                    },
                                    {
                                        value: 4,
                                        desc: '땅콩',
                                    },
                                    {
                                        value: 5,
                                        desc: '대두',
                                    },
                                    {
                                        value: 6,
                                        desc: '밀',
                                    },
                                    {
                                        value: 7,
                                        desc: '고등어',
                                    },
                                    {
                                        value: 8,
                                        desc: '게',
                                    },
                                    {
                                        value: 9,
                                        desc: '새우',
                                    },
                                    {
                                        value: 10,
                                        desc: '돼지고기',
                                    },
                                    {
                                        value: 11,
                                        desc: '복숭아',
                                    },
                                    {
                                        value: 12,
                                        desc: '토마토',
                                    },
                                    {
                                        value: 13,
                                        desc: '아황산류',
                                    },
                                    {
                                        value: 14,
                                        desc: '호두',
                                    },
                                    {
                                        value: 15,
                                        desc: '닭고기',
                                    },
                                    {
                                        value: 16,
                                        desc: '쇠고기',
                                    },
                                    {
                                        value: 17,
                                        desc: '오징어',
                                    },
                                    {
                                        value: 18,
                                        desc: '조개류',
                                    },
                                    {
                                        value: 19,
                                        desc: '잣',
                                    },
                                ],
                            },
                            {
                                name: 'image',
                                type: 'string',
                                info: '급식 이미지의 base64 인코딩',
                                optional: true,
                            },
                            {
                                name: 'score',
                                type: 'number',
                                info:
                                    '급식 점수. [0-1]. 평가가 없을 경우 0.5를 반환.',
                                optional: true,
                            },
                            {
                                name: 'kacl',
                                type: 'number',
                                info: '급식의 열량',
                                optional: true,
                            },
                            {
                                name: 'origin[].name',
                                type: 'string',
                                info: '원산지를 나타낼 재료',
                                optional: true,
                            },
                            {
                                name: 'origin[].origin',
                                type: 'string',
                                info: '재료의 원산지',
                                optional: true,
                            },
                            {
                                name: 'energy[].name',
                                type: 'string',
                                info: '급식의 영양분 요소',
                                optional: true,
                            },
                            {
                                name: 'energy[].value',
                                type: 'number',
                                info: '영양분의 수치',
                                optional: true,
                            },
                            {
                                name: 'energy[].unit',
                                type: 'string',
                                info: '영양분의 단위',
                                optional: true,
                            },
                        ],
                    }}
                />
                <APIInfo
                    path='/vote'
                    method='POST'
                    info='급식을 평가합니다.'
                    beta
                    signin
                    request={{
                        raw: `{
    year: number,
    month: number,
    day: number,
    type: number,
}`,
                        props: [
                            {
                                name: 'year',
                                type: 'number',
                                info: '평가할 급식 정보의 연도',
                            },
                            {
                                name: 'month',
                                type: 'number',
                                info: '평가할 급식 정보의 월',
                            },
                            {
                                name: 'day',
                                type: 'number',
                                info: '평가할 급식 정보의 일',
                            },
                            {
                                name: 'type',
                                type: 'enum',
                                info: '평가할 급식 정보의 종류',
                                enum_val: [
                                    {
                                        value: 0,
                                        desc: '아침',
                                    },
                                    {
                                        value: 1,
                                        desc: '점심',
                                    },
                                    {
                                        value: 2,
                                        desc: '저녁',
                                    },
                                ],
                            },
                        ],
                    }}
                    response={{
                        raw: ``,
                        props: [],
                    }}
                />
            </>
        )
    }
}

export default withRouter(OpenAPIMeal)
