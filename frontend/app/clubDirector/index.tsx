import * as React from 'react'
import { Typography } from '@rmwc/typography'
import { Link, withRouter } from 'react-router-dom'
import {
    TopAppBar,
    TopAppBarRow,
    TopAppBarSection,
    TopAppBarTitle,
} from '@rmwc/top-app-bar'
import {
    Dialog,
    DialogTitle,
    DialogButton,
    DialogContent,
    DialogActions,
} from '@rmwc/dialog'
import {
    DataTable,
    DataTableContent,
    DataTableHead,
    DataTableHeadCell,
    DataTableRow,
    DataTableBody,
    DataTableCell,
} from '@rmwc/data-table'
import { useState, useEffect } from 'react'
import { TextField } from '@rmwc/textfield'
import { Select } from '@rmwc/select'
import { CollapsibleList, List, SimpleListItem } from '@rmwc/list'
import { Checkbox } from '@rmwc/checkbox'
import { createSnackbarQueue, SnackbarQueue } from '@rmwc/snackbar'
import { fetchAPI } from '../../util'
import { Button } from '@rmwc/button'
import { Grid, GridCell, GridRow } from '@rmwc/grid'
import { Club, Person } from '../../../scheme/user'
import { Elevation } from '@rmwc/elevation'
import { TabBar, Tab } from '@rmwc/tabs'
import { Badge } from '@rmwc/badge'
import { IconButton } from '@rmwc/icon-button'
import { focusNextInput, uploadFile, UserImage, FileInput } from '../../util'
import { cond } from 'lodash'

let qu = createSnackbarQueue()
let messages = qu.messages
let notify = qu.notify

let today = new Date()
let currentYear = today.getFullYear()

let clubDataList: any
let firstClub
let secondClub
let studentList
fetchAPI('GET', {}, 'club', 'cut').then((res) => {
    clubDataList = res.data
    firstClub = clubDataList
        .filter((e) => e.permission === '1')
        .map((e) => e.name)
    secondClub = clubDataList
        .filter((e) => e.permission === '2')
        .map((e) => e.name)
    firstClub.push('없음')
    secondClub.push('없음')
})

fetchAPI('GET', {}, 'clubPerson', 'person').then((res) => {
    studentList = res.data
    console.log(studentList)
})

function ClubTable(name: any) {
    const [data, setData] = useState({
        permission: '',
        name: '',
        subject: '',
        introduce: '',
        interview: '',
        interviewTime: '',
        coverLetter: '',
        maxStudent: '',
        url: '',
        backgroundColor1: '',
        backgroundColor2: '',
        backgroundColor3: '',
    })
    useEffect(() => {
        let club_data = clubDataList.filter(
            (e) => e.name === name.name
        )[0] as Club
        console.log(clubDataList, name.name)
        if (club_data !== undefined) {
            setData({
                permission: club_data.permission,
                name: club_data.name,
                subject: club_data.subject === null ? '' : club_data.subject,
                introduce:
                    club_data.introduce === null ? '' : club_data.introduce,
                interview:
                    club_data.interview === null ? '' : club_data.interview,
                interviewTime:
                    club_data.interviewTime === null
                        ? ''
                        : club_data.interviewTime,
                coverLetter:
                    club_data.coverLetter === null ? '' : club_data.coverLetter,
                maxStudent:
                    club_data.maxStudent === null ? '' : club_data.maxStudent,
                url: club_data.url === null ? '' : club_data.url,
                backgroundColor1:
                    club_data.backgroundColor1 === null
                        ? ''
                        : club_data.backgroundColor1,
                backgroundColor2:
                    club_data.backgroundColor2 === null
                        ? ''
                        : club_data.backgroundColor2,
                backgroundColor3:
                    club_data.backgroundColor3 === null
                        ? ''
                        : club_data.backgroundColor3,
            })
        }
    }, name)

    const [poster, setPoster] = React.useState({
        file: '',
        previewURL: undefined,
    })

    const [logo, setLogo] = React.useState({
        file: '',
        previewURL: undefined,
    })

    return (
        <div
            style={{
                overflowX: 'hidden',
                overflowY: 'auto',
                height: '85%',
            }}>
            <div
                style={{
                    color: 'black',
                    textAlign: 'center',
                    justifyContent: 'center',
                }}>
                <Grid>
                    <GridRow>
                        <GridCell desktop={2} tablet={3} phone={4}>
                            <TextField
                                invalid
                                outlined
                                style={{
                                    maxWidth: '200px',
                                    width: '100%',
                                }}
                                label='동아리 분류'
                                onKeyDown={(e: any) => {
                                    if (e.key === 'Enter') {
                                        focusNextInput()
                                    }
                                }}
                                value={
                                    data.permission === '2'
                                        ? '제2동아리'
                                        : '제1동아리'
                                }
                            />
                        </GridCell>
                        <GridCell desktop={2} tablet={4} phone={4}>
                            <TextField
                                invalid
                                outlined
                                style={{
                                    maxWidth: '200px',
                                    width: '100%',
                                }}
                                label='동아리 명'
                                onKeyDown={(e: any) => {
                                    if (e.key === 'Enter') {
                                        focusNextInput()
                                    }
                                }}
                                value={data.name}
                            />
                        </GridCell>
                        <GridCell desktop={2} tablet={4} phone={4}>
                            <TextField
                                outlined
                                style={{
                                    maxWidth: '200px',
                                    width: '100%',
                                }}
                                label='동아리 과목'
                                onKeyDown={(e: any) => {
                                    if (e.key === 'Enter') {
                                        focusNextInput()
                                    }
                                }}
                                value={data.subject}
                                onChange={(e: any) =>
                                    setData({
                                        ...data,
                                        subject: e.currentTarget.value,
                                    })
                                }
                            />
                        </GridCell>
                    </GridRow>
                    <br />
                    <GridRow>
                        <GridCell desktop={2} tablet={4} phone={4}>
                            <TextField
                                outlined
                                label='배경 1'
                                type='color'
                                style={{
                                    maxWidth: '200px',
                                    width: '100%',
                                }}
                                onKeyDown={(e: any) => {
                                    if (e.key === 'Enter') {
                                        focusNextInput()
                                    }
                                }}
                                value={data.backgroundColor1}
                                onChange={(e: any) =>
                                    setData({
                                        ...data,
                                        backgroundColor1: e.currentTarget.value,
                                    })
                                }
                            />
                        </GridCell>
                        <GridCell desktop={2} tablet={4} phone={4}>
                            <TextField
                                outlined
                                label='배경 2'
                                type='color'
                                style={{
                                    maxWidth: '200px',
                                    width: '100%',
                                }}
                                onKeyDown={(e: any) => {
                                    if (e.key === 'Enter') {
                                        focusNextInput()
                                    }
                                }}
                                value={data.backgroundColor2}
                                onChange={(e: any) =>
                                    setData({
                                        ...data,
                                        backgroundColor2: e.currentTarget.value,
                                    })
                                }
                            />
                        </GridCell>
                        <GridCell desktop={2} tablet={4} phone={4}>
                            <TextField
                                outlined
                                label='배경 3'
                                type='color'
                                style={{
                                    maxWidth: '200px',
                                    width: '100%',
                                }}
                                onKeyDown={(e: any) => {
                                    if (e.key === 'Enter') {
                                        focusNextInput()
                                    }
                                }}
                                value={data.backgroundColor3}
                                onChange={(e: any) =>
                                    setData({
                                        ...data,
                                        backgroundColor3: e.currentTarget.value,
                                    })
                                }
                            />
                        </GridCell>
                    </GridRow>
                    <br />
                    <GridRow>
                        <GridCell desktop={2} tablet={4} phone={4}>
                            <TextField
                                outlined
                                label='자소서(O/X)'
                                style={{
                                    maxWidth: '200px',
                                    width: '100%',
                                }}
                                onKeyDown={(e: any) => {
                                    if (e.key === 'Enter') {
                                        focusNextInput()
                                    }
                                }}
                                value={data.coverLetter}
                                onChange={(e: any) =>
                                    setData({
                                        ...data,
                                        coverLetter: e.currentTarget.value,
                                    })
                                }
                            />
                        </GridCell>
                        <GridCell desktop={2} tablet={4} phone={4}>
                            <TextField
                                outlined
                                label='면접(O/X)'
                                style={{
                                    maxWidth: '200px',
                                    width: '100%',
                                }}
                                onKeyDown={(e: any) => {
                                    if (e.key === 'Enter') {
                                        focusNextInput()
                                    }
                                }}
                                value={data.interview}
                                onChange={(e: any) =>
                                    setData({
                                        ...data,
                                        interview: e.currentTarget.value,
                                    })
                                }
                            />
                        </GridCell>
                        <GridCell desktop={2} tablet={4} phone={4}>
                            <TextField
                                outlined
                                label='일시(없을 시 공란)'
                                style={{
                                    maxWidth: '200px',
                                    width: '100%',
                                }}
                                helpText={{
                                    children:
                                        '.....추후공지 | 00/00 0차시 면학',
                                }}
                                onKeyDown={(e: any) => {
                                    if (e.key === 'Enter') {
                                        focusNextInput()
                                    }
                                }}
                                value={data.interviewTime}
                                onChange={(e: any) =>
                                    setData({
                                        ...data,
                                        interviewTime: e.currentTarget.value,
                                    })
                                }
                            />
                        </GridCell>
                    </GridRow>
                    <GridRow>
                        <GridCell desktop={6} tablet={4} phone={4}>
                            <TextField
                                style={{ minWidth: '41.3vw' }}
                                outlined
                                label='자소서 링크'
                                onKeyDown={(e: any) => {
                                    if (e.key === 'Enter') {
                                        focusNextInput()
                                    }
                                }}
                                value={data.url}
                                onChange={(e: any) =>
                                    setData({
                                        ...data,
                                        url: e.currentTarget.value,
                                    })
                                }
                            />
                        </GridCell>
                    </GridRow>
                    <br />
                    <GridRow>
                        <GridCell desktop={6} tablet={4} phone={4}>
                            <TextField
                                textarea
                                maxLength={500}
                                style={{ minWidth: '41.3vw' }}
                                rows={10}
                                outlined
                                label='동아리 소개'
                                onKeyDown={(e: any) => {
                                    if (e.key === 'Enter') {
                                        focusNextInput()
                                    }
                                }}
                                value={data.introduce}
                                onChange={(e: any) =>
                                    setData({
                                        ...data,
                                        introduce: e.currentTarget.value,
                                    })
                                }
                            />
                        </GridCell>
                    </GridRow>
                    <br />
                    <GridRow>
                        <GridCell desktop={2} tablet={4} phone={4}>
                            <TextField
                                outlined
                                label='최대인원'
                                style={{
                                    maxWidth: '200px',
                                    width: '100%',
                                }}
                                onKeyDown={(e: any) => {
                                    if (e.key === 'Enter') {
                                        focusNextInput()
                                    }
                                }}
                                value={data.maxStudent}
                                onChange={(e: any) =>
                                    setData({
                                        ...data,
                                        maxStudent: e.currentTarget.value,
                                    })
                                }
                            />
                        </GridCell>
                        <GridCell desktop={1} tablet={4} phone={4}>
                            <TextField
                                style={{ width: '100%', height: '100%' }}
                                outlined
                                label='포스터'
                                accept='image/*'
                                onKeyDown={(e: any) => {
                                    if (e.key === 'Enter') focusNextInput()
                                }}
                                onClick={() => {
                                    let ele = document.getElementById(
                                        'onPoster'
                                    )
                                    ele.click()
                                }}
                            />
                            <input
                                id='onPoster'
                                type='file'
                                accept='image/*'
                                style={{ display: 'none' }}
                                onChange={(e: any) => {
                                    e.preventDefault()
                                    let reader = new FileReader()
                                    let file = e.target.files[0]
                                    reader.onloadend = () => {
                                        setPoster({
                                            file: file,
                                            previewURL: reader.result,
                                        })
                                    }
                                    reader.readAsDataURL(file)
                                }}
                            />
                        </GridCell>
                        <GridCell desktop={1} tablet={4} phone={4}>
                            <TextField
                                style={{ width: '100%', height: '100%' }}
                                outlined
                                label='로고'
                                accept='image/*'
                                onKeyDown={(e: any) => {
                                    if (e.key === 'Enter') focusNextInput()
                                }}
                                onClick={() => {
                                    let ele = document.getElementById('onLogo')
                                    ele.click()
                                }}
                            />
                            <input
                                id='onLogo'
                                type='file'
                                accept='image/*'
                                style={{ display: 'none' }}
                                onChange={(e: any) => {
                                    e.preventDefault()
                                    let reader = new FileReader()
                                    let file = e.target.files[0]
                                    reader.onloadend = () => {
                                        setLogo({
                                            file: file,
                                            previewURL: reader.result,
                                        })
                                    }
                                    reader.readAsDataURL(file)
                                }}
                            />
                        </GridCell>
                        <GridCell desktop={2} tablet={4} phone={4}>
                            <Button
                                style={{
                                    height: '100%',
                                    minHeight: '45.2px',
                                }}
                                outlined
                                label='저장'
                                trailingIcon='send'
                                onClick={() => {
                                    fetchAPI(
                                        'POST',
                                        { data },
                                        'club',
                                        'set'
                                    ).then((res) => {
                                        if (!res.success) {
                                            notify({
                                                title: <b>오류</b>,
                                                body: res.message,
                                                icon: 'error_outline',
                                                dismissIcon: true,
                                            })
                                        }
                                    })
                                }}
                            />
                        </GridCell>
                    </GridRow>
                </Grid>
            </div>
            <div
                style={{
                    backgroundColor: data.backgroundColor1,
                    color: 'white',
                    width: '36vw',
                    height: '50vh',
                    overflow: 'hidden',
                    padding: '1%',
                    float: 'right',
                    position: 'absolute',
                    top: '10vw',
                    right: '20vh',
                }}>
                <div
                    style={{
                        backgroundColor: data.backgroundColor2,
                        height: '100%',
                        width: '18vw',
                        float: 'left',
                        textAlign: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                        objectFit: 'contain',
                        overflow: 'hidden',
                    }}>
                    <img
                        src={poster.previewURL}
                        style={{ maxHeight: '100%' }}
                    />
                </div>
                <div
                    style={{
                        backgroundColor: data.backgroundColor3,
                        height: '100%',
                        width: '18vw',
                        float: 'left',
                        display: 'grid',
                    }}>
                    <div
                        style={{
                            height: '10vh',
                            backgroundColor: data.backgroundColor3,
                        }}>
                        <img
                            src={logo.previewURL}
                            style={{
                                maxHeight: '10%',
                                position: 'absolute',
                                marginTop: '0',
                                marginLeft: '-9vw',
                            }}
                        />
                        <br />
                        <p
                            style={{
                                textAlign: 'center',
                                marginTop: '1vh',
                                fontSize: '3vh',
                            }}>
                            {data.name}
                        </p>
                    </div>
                    <div
                        style={{
                            textAlign: 'right',
                            marginTop: '0.5vh',
                            marginRight: '0.7vw',
                            fontSize: '2vh',
                        }}>
                        {data.permission === '2' ? '제2동아리' : '제1동아리'}
                    </div>
                    <div
                        style={{
                            textAlign: 'right',
                            marginTop: '0.1vh',
                            fontSize: '2vh',
                            marginRight: '0.7vw',
                        }}>
                        {data.subject}
                    </div>
                    <div
                        style={{
                            textAlign: 'left',
                            marginTop: '0.2vh',
                            fontSize: '1.5vh',
                            marginLeft: '0.7vw',
                        }}>
                        소개
                    </div>
                    <div
                        style={{
                            margin: '3vh',
                            minHeight: '10vh',
                            wordBreak: 'break-all',
                            overflow: 'hidden',
                            fontSize: '1vh',
                        }}>
                        {data.introduce}
                    </div>
                    <footer style={{ marginTop: 'auto', marginBottom: '2vh' }}>
                        <div
                            style={{
                                textAlign: 'center',
                                margin: '0.5vw',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                            <div
                                style={{
                                    float: 'left',
                                    textAlign: 'center',
                                    margin: '0.3vw',
                                    fontSize: '1.2vh',
                                }}>
                                면접
                                <br />
                                {data.interview}
                            </div>
                            <div
                                style={{
                                    float: 'left',
                                    textAlign: 'center',
                                    margin: '0.3vw',
                                    fontSize: '1.2vh',
                                }}>
                                자소서
                                <br />
                                {data.coverLetter}
                            </div>
                        </div>
                        <div
                            style={{
                                fontSize: '1.2vh',
                            }}>
                            면접 일시 - {data.interviewTime}
                            <br />
                            모집인원 - {data.maxStudent}명 내외
                        </div>
                        <div
                            style={{
                                fontSize: '1.2vh',
                            }}>
                            자소서 제출 링크 <a href={data.url}>(클릭)</a>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    )
}

function InfoStudent(name: any) {
    const [student, setStudent] = React.useState([])
    const [num, setNum] = React.useState(0)
    const [maxNum, setMaxNum] = React.useState(0)

    useEffect(() => {
        setMaxNum(
            Number(
                clubDataList
                    .filter((e) => e.name === name.name)
                    .map((e) => e.maxStudent)[0]
            )
        )
        let club_student
        if (name.permission === '1') {
            club_student = studentList
                .filter(
                    (e) =>
                        e.first1[0] === name.name || e.first2[0] === name.name
                )
                .map((el) => {
                    return {
                        number: el.number,
                        name: el.name,
                        first: el.first1,
                        second: el.first2,
                        isPass:
                            el.first1[0] === name.name
                                ? el.first1[1]
                                : el.first2[1],
                    }
                })
        } else {
            club_student = studentList
                .filter(
                    (e) =>
                        e.second1[0] === name.name || e.second2[0] === name.name
                )
                .map((el) => {
                    return {
                        number: el.number,
                        name: el.name,
                        first: el.second1,
                        second: el.second2,
                        isPass:
                            el.second1[0] === name.name
                                ? el.second1[1]
                                : el.second2[1],
                    }
                })
        }
        if (club_student !== undefined) {
            setStudent(club_student)
            setNum(club_student.filter((e) => e.isPass === 1).length)
        }
    }, name)

    async function sort() {
        let send
        if (name.permission === '1') {
            send = student.map((el) => {
                return {
                    permission: name.permission,
                    number: el.number,
                    isPass:
                        el.first[0] === name.name
                            ? el.isPass === 1 && el.second[1] === 1
                                ? [1, -1]
                                : [el.isPass !== 1 ? -1 : 1, el.second[1]]
                            : [el.first[1], el.isPass !== 1 ? -1 : 1],
                }
            })
        } else {
            send = student.map((el) => {
                return {
                    permission: name.permission,
                    number: el.number,
                    isPass:
                        el.first[0] === name.name
                            ? el.isPass === 1 && el.second[1] === 1
                                ? [1, -1]
                                : [el.isPass !== 1 ? -1 : 1, el.second[1]]
                            : [el.first[1], el.isPass !== 1 ? -1 : 1],
                }
            })
        }
        return send
    }

    async function sortStudent() {
        let send = await sort()
        if (send) {
            fetchAPI('POST', { send }, 'clubPerson', 'set')
                .then((res) => {
                    if (res.success) {
                        notify({
                            title: <b>성공!</b>,
                            body: res.message,
                            icon: 'check',
                            dismissIcon: true,
                        })
                    } else
                        notify({
                            title: <b>오류</b>,
                            body: res.message,
                            icon: 'error_outline',
                            dismissIcon: true,
                        })
                })
                .catch(() => {
                    notify({
                        title: <b>오류</b>,
                        body: '서버와 연결할 수 없어요.',
                        icon: 'error_outline',
                        dismissIcon: true,
                    })
                })
        }
    }

    function color(v: any) {
        if (v === -1) {
            return '#FF6D6D'
        } else if (v === 0) {
            return '#F3C770'
        } else {
            return '#9BC867'
        }
    }

    return (
        <>
            <div
                style={{
                    backgroundColor: '#F1F3F5',
                    float: 'left',
                    width: '45vw',
                    height: '90%',
                }}>
                <p
                    style={{
                        float: 'left',
                        marginLeft: '2vw',
                        marginTop: '1vw',
                        marginBottom: '0vw',
                        fontSize: '2vw',
                        color: 'black',
                    }}>
                    학생리스트
                </p>
                <div
                    style={{
                        border: '10px',
                        width: '39.5vw',
                        height: '73vh',
                        marginTop: '4vw',
                        marginLeft: '2vw',
                        marginRight: '2vw',
                        marginBottom: '2vw',
                        borderStyle: 'double',
                        borderColor: 'black',
                        overflowX: 'hidden',
                        overflowY: 'auto',
                    }}>
                    <DataTable style={{ height: '73vh', width: '39.5vw' }}>
                        <DataTableContent>
                            <DataTableHead>
                                <DataTableRow>
                                    <DataTableHeadCell alignMiddle>
                                        학번
                                    </DataTableHeadCell>
                                    <DataTableHeadCell alignMiddle>
                                        이름
                                    </DataTableHeadCell>
                                    <DataTableHeadCell alignMiddle>
                                        1지망
                                    </DataTableHeadCell>
                                    <DataTableHeadCell alignMiddle>
                                        2지망
                                    </DataTableHeadCell>
                                    <DataTableHeadCell alignMiddle>
                                        작업
                                    </DataTableHeadCell>
                                </DataTableRow>
                            </DataTableHead>
                            <DataTableBody>
                                {student &&
                                    Object.values(student)
                                        .filter((e: any) => e.isPass !== 1)
                                        .map((v: any, i: number) => (
                                            <DataTableRow key={i}>
                                                <DataTableCell>
                                                    {v.number}
                                                </DataTableCell>
                                                <DataTableCell>
                                                    {v.name}
                                                </DataTableCell>
                                                <DataTableCell>
                                                    <div
                                                        style={{
                                                            justifyContent:
                                                                'center',
                                                            display: 'flex',
                                                            alignItems:
                                                                'center',
                                                        }}>
                                                        <div>{v.first[0]}</div>
                                                        <div
                                                            style={{
                                                                background: color(
                                                                    v.first[1]
                                                                ),
                                                                marginLeft:
                                                                    '3px',
                                                                marginBottom:
                                                                    '1.57px',
                                                                borderRadius:
                                                                    '50%',
                                                                width: '10px',
                                                                height: '10px',
                                                            }}
                                                        />
                                                    </div>
                                                </DataTableCell>
                                                <DataTableCell>
                                                    <div
                                                        style={{
                                                            justifyContent:
                                                                'center',
                                                            display: 'flex',
                                                            alignItems:
                                                                'center',
                                                        }}>
                                                        <div>{v.second[0]}</div>
                                                        <div
                                                            style={{
                                                                background: color(
                                                                    v.second[1]
                                                                ),
                                                                marginLeft:
                                                                    '3px',
                                                                marginBottom:
                                                                    '1.57px',
                                                                borderRadius:
                                                                    '50%',
                                                                width: '10px',
                                                                height: '10px',
                                                            }}
                                                        />
                                                    </div>
                                                </DataTableCell>
                                                <DataTableCell>
                                                    <IconButton
                                                        icon='east'
                                                        onClick={() => {
                                                            if (num >= maxNum) {
                                                                notify({
                                                                    title: (
                                                                        <b>
                                                                            오류
                                                                        </b>
                                                                    ),
                                                                    body:
                                                                        '인원이 다 찼습니다.',
                                                                    icon:
                                                                        'error_outline',
                                                                    dismissIcon: true,
                                                                })
                                                            } else {
                                                                if (
                                                                    v
                                                                        .first[0] ===
                                                                    name.name
                                                                ) {
                                                                    setStudent(
                                                                        student.map(
                                                                            (
                                                                                el: any
                                                                            ) => {
                                                                                return el.number ===
                                                                                    v.number
                                                                                    ? {
                                                                                          ...el,
                                                                                          first: [
                                                                                              v
                                                                                                  .first[0],
                                                                                              1,
                                                                                          ],
                                                                                          isPass: 1,
                                                                                      }
                                                                                    : el
                                                                            }
                                                                        )
                                                                    )
                                                                    setNum(
                                                                        num + 1
                                                                    )
                                                                } else {
                                                                    if (
                                                                        v
                                                                            .first[1] ===
                                                                        1
                                                                    ) {
                                                                        notify({
                                                                            title: (
                                                                                <b>
                                                                                    오류
                                                                                </b>
                                                                            ),
                                                                            body:
                                                                                '1지망을 합격한 학생입니다.',
                                                                            icon:
                                                                                'error_outline',
                                                                            dismissIcon: true,
                                                                        })
                                                                    } else {
                                                                        setStudent(
                                                                            student.map(
                                                                                (
                                                                                    el: any
                                                                                ) => {
                                                                                    return el.number ===
                                                                                        v.number
                                                                                        ? {
                                                                                              ...el,
                                                                                              second: [
                                                                                                  v
                                                                                                      .second[0],
                                                                                                  1,
                                                                                              ],
                                                                                              isPass: 1,
                                                                                          }
                                                                                        : el
                                                                                }
                                                                            )
                                                                        )
                                                                        setNum(
                                                                            num +
                                                                                1
                                                                        )
                                                                    }
                                                                }
                                                            }

                                                            console.log(
                                                                student[i]
                                                            )
                                                        }}
                                                    />
                                                </DataTableCell>
                                            </DataTableRow>
                                        ))}
                            </DataTableBody>
                        </DataTableContent>
                    </DataTable>
                </div>
            </div>
            <div
                style={{
                    backgroundColor: '#9BC867',
                    float: 'left',
                    width: '45vw',
                    height: '90%',
                }}>
                <p
                    style={{
                        float: 'left',
                        marginLeft: '2vw',
                        marginTop: '1vw',
                        marginBottom: '0vw',
                        fontSize: '2vw',
                        color: 'black',
                    }}>
                    합격생리스트( 최대 {maxNum}명, 현재 {num}명 )
                </p>
                <Button
                    style={{
                        float: 'right',
                        marginRight: '2vw',
                        marginTop: '1vw',
                        marginBottom: '0vw',
                        color: 'black',
                    }}
                    onClick={() => {
                        sortStudent()
                    }}>
                    확인
                </Button>
                <div
                    style={{
                        border: '10px',
                        width: '39.5vw',
                        height: '73vh',
                        marginTop: '4vw',
                        marginLeft: '2vw',
                        marginRight: '2vw',
                        marginBottom: '0.5vw',
                        borderStyle: 'double',
                        borderColor: 'black',
                        overflowX: 'hidden',
                        overflowY: 'auto',
                    }}>
                    <DataTable style={{ height: '73vh', width: '39.5vw' }}>
                        <DataTableContent>
                            <DataTableHead>
                                <DataTableRow>
                                    <DataTableHeadCell alignMiddle>
                                        학번
                                    </DataTableHeadCell>
                                    <DataTableHeadCell alignMiddle>
                                        이름
                                    </DataTableHeadCell>
                                    <DataTableHeadCell alignMiddle>
                                        1지망
                                    </DataTableHeadCell>
                                    <DataTableHeadCell alignMiddle>
                                        2지망
                                    </DataTableHeadCell>
                                    <DataTableHeadCell alignMiddle>
                                        작업
                                    </DataTableHeadCell>
                                </DataTableRow>
                            </DataTableHead>
                            <DataTableBody>
                                {student &&
                                    Object.values(student)
                                        .filter((e: any) => e.isPass === 1)
                                        .map((v: any, i: number) => (
                                            <DataTableRow key={i}>
                                                <DataTableCell>
                                                    {v.number}
                                                </DataTableCell>
                                                <DataTableCell>
                                                    {v.name}
                                                </DataTableCell>
                                                <DataTableCell>
                                                    <div
                                                        style={{
                                                            justifyContent:
                                                                'center',
                                                            display: 'flex',
                                                            alignItems:
                                                                'center',
                                                        }}>
                                                        <div>{v.first[0]}</div>
                                                        <div
                                                            style={{
                                                                background: color(
                                                                    v.first[1]
                                                                ),
                                                                marginLeft:
                                                                    '3px',
                                                                marginBottom:
                                                                    '1.57px',
                                                                borderRadius:
                                                                    '50%',
                                                                width: '10px',
                                                                height: '10px',
                                                            }}
                                                        />
                                                    </div>
                                                </DataTableCell>
                                                <DataTableCell>
                                                    <div
                                                        style={{
                                                            justifyContent:
                                                                'center',
                                                            display: 'flex',
                                                            alignItems:
                                                                'center',
                                                        }}>
                                                        <div>{v.second[0]}</div>
                                                        <div
                                                            style={{
                                                                background: color(
                                                                    v.second[1]
                                                                ),
                                                                marginLeft:
                                                                    '3px',
                                                                marginBottom:
                                                                    '1.57px',
                                                                borderRadius:
                                                                    '50%',
                                                                width: '10px',
                                                                height: '10px',
                                                            }}
                                                        />
                                                    </div>
                                                </DataTableCell>
                                                <DataTableCell>
                                                    <IconButton
                                                        icon='west'
                                                        onClick={() => {
                                                            if (
                                                                v.first[0] ===
                                                                name.name
                                                            ) {
                                                                setStudent(
                                                                    student.map(
                                                                        (
                                                                            el: any
                                                                        ) => {
                                                                            return el.number ===
                                                                                v.number
                                                                                ? {
                                                                                      ...el,
                                                                                      first: [
                                                                                          v
                                                                                              .first[0],
                                                                                          0,
                                                                                      ],
                                                                                      isPass: 0,
                                                                                  }
                                                                                : el
                                                                        }
                                                                    )
                                                                )
                                                            } else {
                                                                setStudent(
                                                                    student.map(
                                                                        (
                                                                            el: any
                                                                        ) => {
                                                                            return el.number ===
                                                                                v.number
                                                                                ? {
                                                                                      ...el,
                                                                                      second: [
                                                                                          v
                                                                                              .second[0],
                                                                                          0,
                                                                                      ],
                                                                                      isPass: 0,
                                                                                  }
                                                                                : el
                                                                        }
                                                                    )
                                                                )
                                                            }
                                                            setNum(num - 1)
                                                        }}
                                                    />
                                                </DataTableCell>
                                            </DataTableRow>
                                        ))}
                            </DataTableBody>
                        </DataTableContent>
                    </DataTable>
                </div>
            </div>
        </>
    )
}

function About() {
    const [club, setClub] = useState({
        permission: '',
        name: '',
        uid: '',
    })

    const [activeTab, setActiveTab] = useState(0)

    const Section = () => {
        if (activeTab === 0) {
            console.log(club.name)
            return <ClubTable name={club.name} />
        } else {
            console.log(club.name)
            return <InfoStudent name={club.name} permission={club.permission} />
        }
    }

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                textAlign: 'center',
            }}>
            <Elevation
                z={10}
                style={{
                    color: 'white',
                    width: '90vw',
                    height: '96vh',
                    grid: '2%',
                    marginTop: '1.5vh',
                    overflow: 'hidden',
                }}>
                <header>
                    <Grid>
                        <GridRow>
                            <GridCell desktop={3} tablet={4} phone={4}>
                                <Select
                                    label='종류 선택'
                                    outlined
                                    enhanced
                                    options={[
                                        {
                                            label: '제1동아리',
                                            value: '1',
                                        },
                                        {
                                            label: '제2동아리',
                                            value: '2',
                                        },
                                    ]}
                                    onChange={(e: any) =>
                                        setClub({
                                            ...club,
                                            permission: e.currentTarget.value,
                                        })
                                    }
                                />
                            </GridCell>
                            <GridCell desktop={3} tablet={4} phone={4}>
                                <Select
                                    label='동아리 선택'
                                    outlined
                                    enhanced
                                    options={
                                        club.permission === '2'
                                            ? secondClub
                                            : firstClub
                                    }
                                    onChange={(e: any) =>
                                        setClub({
                                            ...club,
                                            name: e.currentTarget.value,
                                        })
                                    }
                                />
                            </GridCell>
                            <GridCell
                                desktop={3}
                                tablet={8}
                                phone={4}></GridCell>
                            <GridCell desktop={3} tablet={8} phone={4}>
                                <TabBar
                                    activeTabIndex={activeTab}
                                    onActivate={(evt: any) =>
                                        setActiveTab(evt.detail.index)
                                    }>
                                    <Tab>창 설정</Tab>
                                    <Tab>인원 확인</Tab>
                                </TabBar>
                            </GridCell>
                        </GridRow>
                    </Grid>
                </header>
                <Section />
            </Elevation>

            <SnackbarQueue messages={messages} />
        </div>
    )
}

export default withRouter(About)
