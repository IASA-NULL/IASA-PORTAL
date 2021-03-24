import * as React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'

import { Typography } from '@rmwc/typography'

import { BrIfMobile, fetchAPI } from '../util'
import { createSnackbarQueue, SnackbarQueue } from '@rmwc/snackbar'
import { Tab, TabBar } from '@rmwc/tabs'
import { MyeonbulQuery } from '../../scheme/api/myeonbul'
import { Gender, UID } from '../../scheme/user'
import { Button } from '@rmwc/button'
import _ from 'lodash'
import { IconButton } from '@rmwc/icon-button'
import commonApi from '../../scheme/api/commonApi'
import { Permission } from '../../scheme/api/auth'

let currentSelected: {
    uid: UID
    sid?: number
    name: string
    avatar?: string
    gender: Gender
}

function DraggableUser(props: {
    uid: UID
    sid?: number
    name: string
    avatar?: string
    updateSid?: any
    gender: Gender
}) {
    const [isDragging, setDragging] = React.useState(false)
    return (
        <>
            <span
                draggable='true'
                style={{
                    userSelect: 'none',
                    ...(isDragging && { opacity: '50%' }),
                    margin: '-15px 10px',
                    display: 'inline-block',
                }}
                onDragStart={(e) => {
                    setDragging(true)
                    e.dataTransfer.effectAllowed = 'move'
                    currentSelected = _.pick(props, [
                        'uid',
                        'sid',
                        'name',
                        'avatar',
                        'gender',
                    ])
                }}
                onDragEnd={() => {
                    setDragging(false)
                    currentSelected = null
                }}>
                <span
                    style={{
                        padding: '10px',
                        border: '1px solid rgb(136, 136, 136)',
                        borderRadius: '100px',
                        width: 'fit-content',
                    }}>
                    {props.name}
                    <span style={{ color: '#888' }}>
                        {props.sid
                            ? ` ${props.sid}`
                            : ` ${
                                  parseInt(props.uid.toString().slice(0, 4)) -
                                  2015
                              }기`}
                    </span>
                    {props.sid && (
                        <IconButton
                            icon='add'
                            style={{ top: '5px', margin: '0 -10px 0 0' }}
                            onClick={() => {
                                props.updateSid(
                                    parseInt(props.sid.toString().slice(1, 2)) -
                                        1,
                                    props.sid.toString()
                                )
                            }}
                        />
                    )}
                </span>
            </span>
        </>
    )
}

interface IState {
    targetAge: number
    loaded: boolean
    data?: any
    classes?: {
        uid: UID
        sid?: number
        name: string
        avatar?: string
        gender: Gender
    }[][][]
    unassigned?: {
        uid: UID
        name: string
        avatar?: string
        sid?: number
        gender: Gender
    }[]
}

class Assign extends React.Component<any, IState> {
    messages: any
    notify: any

    constructor(props: RouteComponentProps) {
        super(props)
        let qu = createSnackbarQueue()
        this.messages = qu.messages
        this.notify = qu.notify
        this.state = {
            targetAge: 0,
            loaded: false,
            classes: [[], [], []],
            unassigned: [],
        }
        this.refresh()
    }

    public handleChange(e: React.FormEvent<HTMLInputElement>, target: string) {
        // @ts-ignore
        this.setState({ [target]: e.target.value })
    }

    public refresh() {
        this.setState({ loaded: false })
        fetchAPI('POST', { type: [Permission.student] }, 'account', 'list')
            .then((res: commonApi) => {
                if (res.success) {
                    let classes = [[[]], [[]], [[]]] as {
                        uid: UID
                        sid?: number
                        name: string
                        avatar?: string
                        gender: Gender
                    }[][][]
                    let unassigned = [] as {
                        uid: UID
                        sid?: number
                        name: string
                        avatar?: string
                        gender: Gender
                    }[]
                    for (let i of res.data) {
                        if (!i.sid) unassigned.push(i)
                        else {
                            const age = parseInt(i.sid.toString()[0]) - 1
                            const classNo = parseInt(i.sid.toString()[1]) - 1
                            while (classes[age].length < classNo + 1)
                                classes[age].push([])
                            classes[age][classNo].push(i)
                        }
                    }
                    this.setState({
                        loaded: true,
                        classes: classes,
                        unassigned: unassigned,
                    })
                } else
                    this.notify({
                        title: <b>오류</b>,
                        body: res.message,
                        icon: 'error_outline',
                        dismissIcon: true,
                    })
            })
            .catch(() => {
                this.notify({
                    title: <b>오류</b>,
                    body: '서버와 연결할 수 없어요.',
                    icon: 'error_outline',
                    dismissIcon: true,
                })
            })
    }

    public updateSid(classNo: number, sid: number) {
        let classes = this.state.classes
        for (
            let i = 0;
            i < classes[this.state.targetAge][classNo].length;
            i++
        ) {
            if (classes[this.state.targetAge][classNo][i].sid >= sid)
                classes[this.state.targetAge][classNo][i].sid += 1
        }
        this.setState({ classes: classes })
    }

    public reassignSid() {
        let classes = this.state.classes
        let unassigned = this.state.unassigned
        for (let age = 0; age < 3; age++) {
            for (let classNo = 0; classNo < classes[age].length; classNo++) {
                classes[age][classNo] = _.sortBy(classes[age][classNo], [
                    'name',
                ])
                for (
                    let uidx = 0;
                    uidx < classes[age][classNo].length;
                    uidx++
                ) {
                    if (uidx)
                        classes[age][classNo][uidx].sid =
                            classes[age][classNo][uidx - 1].sid + 1
                    else
                        classes[age][classNo][uidx].sid =
                            (age + 1) * 1000 + (classNo + 1) * 100 + uidx + 1
                }
            }
        }
        unassigned = _.sortBy(unassigned, [
            (o) => {
                return o.uid.toString().slice(0, 4)
            },
            'name',
        ])
        this.setState({ classes: classes, unassigned: unassigned })
    }

    public render() {
        let grid: string
        if (document.documentElement.offsetWidth < 550) grid = '1fr'
        else if (document.documentElement.offsetWidth < 1090) grid = '1fr 1fr'
        else if (document.documentElement.offsetWidth < 1440)
            grid = '1fr 1fr 1fr'
        else grid = '1fr 1fr 1fr 1fr'

        return (
            <>
                <Typography use='headline3'>반 배정</Typography>
                <BrIfMobile />
                <Typography use='subtitle1' style={{ marginLeft: '10px' }}>
                    학생들의 반을 배정해요.
                </Typography>
                <br />
                <br />
                <TabBar
                    activeTabIndex={this.state.targetAge}
                    onActivate={(evt) => {
                        this.setState({ targetAge: evt.detail.index })
                    }}>
                    <Tab>1학년</Tab>
                    <Tab>2학년</Tab>
                    <Tab>3학년</Tab>
                </TabBar>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: grid,
                    }}>
                    {this.state?.classes[this.state.targetAge]?.map(
                        (cl, idx) => {
                            return (
                                <div
                                    style={{
                                        minHeight: '300px',
                                        margin: '23px',
                                        borderRadius: '3px',
                                        border: 'solid 1px #888',
                                        padding: '20px 0',
                                    }}
                                    onDragOver={(e) => {
                                        if (e.preventDefault) {
                                            e.preventDefault()
                                        }
                                        e.dataTransfer.dropEffect = 'move'
                                        return false
                                    }}
                                    onDrop={(e) => {
                                        if (e.stopPropagation)
                                            e.stopPropagation()
                                        let classes = this.state.classes
                                        let unassigned = this.state.unassigned
                                        if (currentSelected.sid) {
                                            const currentClass =
                                                parseInt(
                                                    currentSelected.sid.toString()[1]
                                                ) - 1
                                            _.remove(
                                                classes[this.state.targetAge][
                                                    currentClass
                                                ],
                                                {
                                                    uid: currentSelected.uid,
                                                }
                                            )
                                        } else {
                                            _.remove(unassigned, {
                                                uid: currentSelected.uid,
                                            })
                                        }
                                        classes[this.state.targetAge][idx].push(
                                            {
                                                ...currentSelected,
                                            }
                                        )
                                        this.setState({
                                            classes: classes,
                                            unassigned: unassigned,
                                        })
                                        this.reassignSid()
                                        return false
                                    }}>
                                    <Typography
                                        use='headline6'
                                        style={{
                                            textAlign: 'center',
                                            margin: 'auto',
                                            display: 'block',
                                        }}>
                                        {idx + 1}반
                                    </Typography>
                                    <br />
                                    {this.state.classes[this.state.targetAge][
                                        idx
                                    ].map((el) => {
                                        return (
                                            <>
                                                <DraggableUser
                                                    name={el.name}
                                                    uid={el.uid}
                                                    sid={el.sid}
                                                    avatar={el.avatar}
                                                    updateSid={this.updateSid.bind(
                                                        this
                                                    )}
                                                    gender={el.gender}
                                                />
                                                <br />
                                                <br />
                                            </>
                                        )
                                    })}
                                </div>
                            )
                        }
                    )}
                </div>
                <Button
                    outlined
                    label='반 줄이기'
                    trailingIcon='remove'
                    onClick={() => {
                        let classes = this.state.classes
                        let unassigned = this.state.unassigned
                        let left = classes[this.state.targetAge].pop()
                        for (let i of left) unassigned.push(i)
                        this.setState({
                            classes: classes,
                        })
                        this.reassignSid()
                    }}
                />{' '}
                <Button
                    outlined
                    label='반 추가'
                    trailingIcon='add'
                    onClick={() => {
                        let students = this.state?.classes
                        this.state?.classes[this.state.targetAge].push([])
                        this.setState({
                            classes: students,
                        })
                    }}
                />
                <div
                    style={{
                        width: 'calc(100% - 66px)',
                        minHeight: '300px',
                        margin: '23px',
                        borderRadius: '3px',
                        border: 'solid 1px #888',
                        padding: '20px 0',
                    }}
                    onDragOver={(e) => {
                        if (e.preventDefault) {
                            e.preventDefault()
                        }
                        e.dataTransfer.dropEffect = 'move'
                        return false
                    }}
                    onDrop={(e) => {
                        if (e.stopPropagation) e.stopPropagation()
                        let classes = this.state.classes
                        let unassigned = this.state.unassigned
                        if (currentSelected.sid) {
                            const currentClass =
                                parseInt(currentSelected.sid.toString()[1]) - 1
                            _.remove(
                                classes[this.state.targetAge][currentClass],
                                {
                                    uid: currentSelected.uid,
                                }
                            )
                        } else {
                            _.remove(unassigned, {
                                uid: currentSelected.uid,
                            })
                        }
                        unassigned.push({
                            ...currentSelected,
                        })
                        this.setState({
                            classes: classes,
                            unassigned: unassigned,
                        })
                        this.reassignSid()
                        return false
                    }}>
                    <Typography
                        use='headline6'
                        style={{
                            textAlign: 'center',
                            margin: 'auto',
                            display: 'block',
                        }}>
                        배정 안된 학생들
                    </Typography>
                    {this.state.unassigned.map((el) => {
                        return (
                            <>
                                <DraggableUser
                                    name={el.name}
                                    uid={el.uid}
                                    avatar={el.avatar}
                                    gender={el.gender}
                                />
                                <br />
                                <br />
                            </>
                        )
                    })}
                </div>
                <Button
                    outlined
                    label='저장'
                    trailingIcon='save'
                    onClick={() => {}}
                />
                <SnackbarQueue messages={this.messages} />
            </>
        )
    }
}

export default withRouter(Assign)
