import * as React from 'react'
import { BrIfMobile } from '../util'

import { Typography } from '@rmwc/typography'
import { Badge } from '@rmwc/badge'
import { Chip } from '@rmwc/chip'

import SyntaxHighlighter from 'react-syntax-highlighter'
import { github } from 'react-syntax-highlighter/dist/esm/styles/hljs'

export function CodeBlock(props: { code: string }) {
    return (
        <SyntaxHighlighter
            language='typescript'
            showLineNumbers
            style={github}
            wrapLines>
            {props.code}
        </SyntaxHighlighter>
    )
}

function stringIterator(data: any, currentPath = 'data', indent = 0) {
    let str = ''
    if (data._type === 'object') {
        str += ' '.repeat(indent * 4) + currentPath + ': {\n'
        for (let i in data) {
            if (i[0] === '_') continue
            str += stringIterator(data[i], i, indent + 1)
        }
        str = str.slice(0, -2) + '\n'
        str += ' '.repeat(indent * 4) + '}' + (data._isArray ? '[]' : '')
        if (indent) str += ',\n'
    } else {
        str =
            ' '.repeat(indent * 4) +
            currentPath +
            ': ' +
            data._type +
            (data._isArray ? '[]' : '') +
            ',\n'
    }
    return str
}

function typeToTSCode(
    props: {
        name: string
        type: string
        info: string
        enum_val?: { value: any; desc: string }[]
        optional?: boolean
    }[],
    isArray: boolean
) {
    let data = {} as any
    if (props[0].name === 'data') {
        return 'data: ' + props[0].type
    }
    for (let i of props) {
        let path = i.name.split('.'),
            currentPath = data
        for (let j of path.slice(0, -1)) {
            let isArray = false
            if (j.slice(-2) === '[]') {
                isArray = true
                j = j.slice(0, -2)
            }
            if (!currentPath[j])
                currentPath[j] = { _type: 'object', _isArray: isArray }
            currentPath = currentPath[j]
        }
        if (path.slice(-1)[0].slice(-2) === '[]')
            currentPath[path.slice(-1)[0].slice(0, -2)] = {
                _type: i.type,
                _isArray: true,
            }
        else
            currentPath[path.slice(-1)[0]] = {
                _type: i.type,
                _isArray: false,
            }
    }
    data = { _type: 'object', _isArray: isArray, ...data }
    return stringIterator(data)
}

export function APIInfo(props: {
    path: string
    method: string
    info: string
    secure?: boolean
    beta?: boolean
    signin?: boolean
    studentOnly?: boolean
    teacherOnly?: boolean
    request?: {
        desc?: string
        props: {
            name: string
            type: string
            info: string
            enum_val?: { value: any; desc: string }[]
            optional?: boolean
        }[]
        isArray?: boolean
    }
    response: {
        desc?: string
        props: {
            name: string
            type: string
            info: string
            enum_val?: { value: any; desc: string }[]
            optional?: boolean
        }[]
        isArray?: boolean
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
            {props.studentOnly && <Badge align='inline' label='학생 전용' />}
            {props.teacherOnly && <Badge align='inline' label='선생님 전용' />}
            <br />
            {props.request && (
                <>
                    <br />
                    <Typography use='headline5'>요청</Typography>
                    <br />
                    <br />
                    <CodeBlock
                        code={typeToTSCode(
                            props.request.props,
                            props.request.isArray
                        ).slice(6)}
                    />
                    <br />
                </>
            )}
            {props.request && props.request.desc && <br />}
            {props.request &&
                props.request.props.map((el) => {
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
                code={typeToTSCode(
                    props.response.props,
                    props.response.isArray
                )}
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
                            optional={el.optional}
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
