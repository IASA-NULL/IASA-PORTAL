import * as React from 'react'
import { BrIfMobile } from '../util'

import { Typography } from '@rmwc/typography'
import { Badge } from '@rmwc/badge'
import { Chip } from '@rmwc/chip'
import { CodeBlock, github } from 'react-code-blocks'

export function APIInfo(props: {
    path: string
    method: string
    info: string
    secure?: boolean
    beta?: boolean
    signin?: boolean
    request: {
        desc?: string
        raw: string
        props: {
            name: string
            type: string
            info: string
            enum_val?: { value: any; desc: string }[]
            optional?: boolean
        }[]
    }
    response: {
        desc?: string
        raw: string
        props: {
            name: string
            type: string
            info: string
            enum_val?: { value: any; desc: string }[]
            optional?: boolean
        }[]
    }
}) {
    return (
        <>
            <Typography use='headline4'>{props.path}</Typography>
            <BrIfMobile />
            <Typography use='subtitle1' style={{ marginLeft: '10px' }}>
                {props.info}
            </Typography>
            <Badge
                theme={['primaryBg', 'onPrimary']}
                align='inline'
                label={props.method}
            />
            {props.secure && <Badge align='inline' label='HTTPS 전용' />}
            {props.beta && <Badge align='inline' label='베타' />}
            {props.signin && <Badge align='inline' label='로그인 필요' />}
            <br />
            <br />
            <Typography use='headline5'>요청</Typography>
            <br />
            <br />
            <CodeBlock
                text={props.request.raw}
                language='typescript'
                showLineNumbers
                theme={github}
                wrapLines
            />
            <br />
            {props.request.desc && <br />}
            {props.request.props.map((el) => {
                return (
                    <>
                        <PropInfo
                            name={el.name}
                            type={el.type}
                            info={el.info}
                            enum_val={el.enum_val}
                            optional={el.optional}
                        />
                    </>
                )
            })}
            <br />
            <Typography use='headline5'>응답</Typography>
            <br />
            <br />
            <CodeBlock
                text={props.response.raw}
                language='typescript'
                showLineNumbers
                theme={github}
                wrapLines
            />
            <br />
            {props.response.desc && <br />}
            {props.response.props.map((el) => {
                return (
                    <>
                        <PropInfo
                            name={el.name}
                            type={el.type}
                            info={el.info}
                            enum_val={el.enum_val}
                        />
                    </>
                )
            })}
            <br />
        </>
    )
}

export function PropInfo(props: {
    name: string
    type: string
    info: string
    enum_val?: { value: any; desc: string }[]
    optional?: boolean
}) {
    return (
        <>
            <Typography use='headline6'>{props.name}</Typography>
            <Badge
                theme={['primaryBg', 'onPrimary']}
                align='inline'
                label={props.type}
            />
            {props.optional && (
                <Badge
                    theme={['primaryBg', 'onPrimary']}
                    align='inline'
                    label='옵션'
                />
            )}
            <br />
            <p>{props.info}</p>
            {props.enum_val && (
                <>
                    {props.enum_val.map((el) => {
                        return (
                            <>
                                <Chip label={`${el.value} : ${el.desc}`} />{' '}
                            </>
                        )
                    })}
                    <br />
                    <br />
                </>
            )}
        </>
    )
}
