import * as React from 'react'
import { useState } from 'react'
import { withRouter } from 'react-router-dom'

import { Typography } from '@rmwc/typography'
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
import { TextField } from '@rmwc/textfield'
import { Select } from '@rmwc/select'
import { Checkbox } from '@rmwc/checkbox'
import { createSnackbarQueue, SnackbarQueue } from '@rmwc/snackbar'
import { Button } from '@rmwc/button'
import { Grid, GridCell, GridRow } from '@rmwc/grid'

import { fetchAPI } from '../../util'
import TermsOfUse from '../typography/TermsOfUse'
import Footer from '../typography/Footer'

import Swiper from 'react-id-swiper'
import SwiperCore, { Pagination, Navigation } from 'swiper/core'

SwiperCore.use([Pagination, Navigation])

let qu = createSnackbarQueue()
let messages = qu.messages
let notify = qu.notify

let today = new Date()
let currentYear = today.getFullYear()

let club: any
let firstClub
let secondClub
let first
let second
fetchAPI('GET', {}, 'club', 'cut').then((res) => {
    club = res.data
    firstClub = club.filter((e) => e.permission === '1').map((e) => e.name)
    secondClub = club.filter((e) => e.permission === '2').map((e) => e.name)
    first = club.filter((e) => e.permission === '1')
    second = club.filter((e) => e.permission === '2')
    firstClub.push('없음')
    secondClub.push('없음')
})

function Slide({ num }) {
    let print
    const params = {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    }
    if (num === '1') {
        print = first
    } else {
        print = second
    }
    return (
        <Swiper {...params}>
            {(() => {
                if (num === '1') {
                    return (
                        <div>
                            <iframe
                                width='560'
                                height='315'
                                src='https://www.youtube.com/embed/PBTjJLrjKcA'
                                title='YouTube video player'
                                frameBorder='0'
                                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                                allowFullScreen></iframe>
                        </div>
                    )
                } else {
                    return <></>
                }
            })()}
            {print.map((el) => (
                <div>
                    <div
                        style={{
                            backgroundColor: el.backgroundColor1,
                            color: 'white',
                            width: '68vw',
                            height: '80vh',
                            overflow: 'hidden',
                            padding: '2%',
                        }}>
                        <div
                            style={{
                                backgroundColor: el.backgroundColor2,
                                height: '100%',
                                width: '34vw',
                                float: 'left',
                                textAlign: 'center',
                                display: 'flex',
                                justifyContent: 'center',
                            }}>
                            <img style={{ width: '80%', margin: 'auto' }}></img>
                        </div>
                        <div
                            style={{
                                backgroundColor: el.backgroundColor3,
                                height: '100%',
                                width: '34vw',
                                float: 'left',
                                display: 'grid',
                            }}>
                            <div
                                style={{
                                    height: '22vh',
                                    backgroundColor: el.backgroundColor3,
                                }}>
                                <img
                                    style={{
                                        width: '7vh',
                                        height: '7vh',
                                        textAlign: 'left',
                                    }}
                                />
                                <p
                                    style={{
                                        textAlign: 'center',
                                        marginTop: '3vh',
                                        fontSize: '250%',
                                    }}>
                                    {el.name}
                                </p>
                            </div>
                            <div
                                style={{
                                    textAlign: 'right',
                                    marginTop: '1.5vh',
                                    marginRight: '0.7vw',
                                    fontSize: '2.9vh',
                                }}>
                                {el.permission === '2'
                                    ? '제2동아리'
                                    : '제1동아리'}
                            </div>
                            <div
                                style={{
                                    textAlign: 'right',
                                    marginTop: '0.1vh',
                                    fontSize: '3.7vh',
                                    marginRight: '0.7vw',
                                }}>
                                {el.subject}
                            </div>
                            <div
                                style={{
                                    textAlign: 'left',
                                    marginTop: '0.5vh',
                                    fontSize: '2.8vh',
                                    marginLeft: '0.7vw',
                                }}>
                                소개
                            </div>
                            <div
                                style={{
                                    margin: '2vh',
                                    maxHeight: '23vh',
                                    wordBreak: 'break-all',
                                    overflow: 'hidden',
                                }}>
                                {el.introduce}
                            </div>
                            <footer
                                style={{
                                    marginTop: 'auto',
                                    marginBottom: '2vh',
                                }}>
                                <div
                                    style={{
                                        textAlign: 'center',
                                        margin: '2vw',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                    <div
                                        style={{
                                            float: 'left',
                                            textAlign: 'center',
                                            margin: '0.5vw',
                                            fontSize: '3vh',
                                        }}>
                                        면접
                                        <br />
                                        {el.interview}
                                    </div>
                                    <div
                                        style={{
                                            float: 'left',
                                            textAlign: 'center',
                                            margin: '0.5vw',
                                            fontSize: '3vh',
                                        }}>
                                        자소서
                                        <br />
                                        {el.coverLetter}
                                    </div>
                                </div>
                                <div>
                                    면접 일시 - {el.interviewTime}
                                    <br />
                                    모집인원 - {el.maxStudent}명 내외
                                </div>
                                <div>
                                    자소서 제출 링크 <a href={el.url}>(클릭)</a>
                                </div>
                            </footer>
                        </div>
                    </div>
                </div>
            ))}
        </Swiper>
    )
}

function register(
    number: string,
    name: string,
    first1: string,
    first2: string,
    second1: string,
    second2: string
) {
    fetchAPI(
        'POST',
        { number, name, first1, first2, second1, second2 },
        'clubPerson',
        'person'
    )
        .then((res) => {
            if (res.success) {
                notify({
                    title: <b style={{ fontSize: '15px' }}>신청알림</b>,
                    body: (
                        <div>
                            동아리를 성공적으로 신청했습니다.
                            <br />
                            신청확인 버튼으로 제대로 신청했는지 확인해주세요
                        </div>
                    ),
                    icon: 'check',
                    dismissIcon: true,
                })
            } else {
                notify({
                    title: <b>신청알림</b>,
                    body: res.message,
                    icon: 'error_outline',
                    dismissIcon: true,
                })
            }
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

function ClubTable({ number, isCheck }) {
    console.log(number)
    const [info, setInfo] = useState(['', '', '', '', '', ''])
    React.useEffect(() => {
        fetchAPI('POST', { number }, 'clubPerson', 'personInfo').then((res) => {
            if (res.success) {
                let first
                let second
                if (res.data.first1[1] === 1) {
                    first = res.data.first1[0]
                } else if (res.data.first2[1] === 1) {
                    first = res.data.first2[0]
                } else {
                    first = '없음'
                }
                if (res.data.second1[1] === 1) {
                    second = res.data.second1[0]
                } else if (res.data.second2[1] === 1) {
                    second = res.data.second2[0]
                } else {
                    second = '없음'
                }
                setInfo([
                    res.data.first1[0],
                    res.data.first2[0],
                    res.data.second1[0],
                    res.data.second2[0],
                    first,
                    second,
                ])
            }
        })
    }, [isCheck])
    console.log(info)
    return (
        <div style={{ textAlign: 'center' }}>
            <DataTable style={{ width: '250px' }}>
                <DataTableContent>
                    <DataTableHead>
                        <DataTableRow>
                            <DataTableHeadCell alignMiddle>
                                신청현황
                            </DataTableHeadCell>
                            <DataTableHeadCell alignMiddle>
                                1지망
                            </DataTableHeadCell>
                            <DataTableHeadCell alignMiddle>
                                2지망
                            </DataTableHeadCell>
                        </DataTableRow>
                    </DataTableHead>
                    <DataTableBody>
                        <DataTableRow>
                            <DataTableCell alignMiddle>제1동아리</DataTableCell>
                            <DataTableCell alignMiddle>{info[0]}</DataTableCell>
                            <DataTableCell alignMiddle>{info[1]}</DataTableCell>
                        </DataTableRow>
                        <DataTableRow selected>
                            <DataTableCell alignMiddle>제2동아리</DataTableCell>
                            <DataTableCell alignMiddle>{info[2]}</DataTableCell>
                            <DataTableCell alignMiddle>{info[3]}</DataTableCell>
                        </DataTableRow>
                    </DataTableBody>
                </DataTableContent>
            </DataTable>
            <br />
            <br />
            <DataTable style={{ width: '250px' }}>
                <DataTableContent>
                    <DataTableHead>
                        <DataTableRow>
                            <DataTableHeadCell alignMiddle>
                                면접결과
                            </DataTableHeadCell>
                            <DataTableHeadCell alignMiddle>
                                나의 동아리
                            </DataTableHeadCell>
                        </DataTableRow>
                    </DataTableHead>
                    <DataTableBody>
                        <DataTableRow>
                            <DataTableCell alignMiddle>제1동아리</DataTableCell>
                            <DataTableCell alignMiddle>
                                {info[4] === '' ? '없음' : info[4]}
                            </DataTableCell>
                        </DataTableRow>
                        <DataTableRow selected>
                            <DataTableCell alignMiddle>제2동아리</DataTableCell>
                            <DataTableCell alignMiddle>
                                {info[5] === '' ? '없음' : info[5]}
                            </DataTableCell>
                        </DataTableRow>
                    </DataTableBody>
                </DataTableContent>
            </DataTable>
        </div>
    )
}

function About() {
    const [agreeTerms, setAgreeTerms] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [checkOpen, setCheckOpen] = useState(false)
    const [isCheck, setIsCheck] = useState(0)

    const [number, setNumber] = useState('')
    const [name, setName] = useState('')
    const [firstOne, setFirstOne] = useState('')
    const [firstTwo, setFirstTwo] = useState('')
    const [secondOne, setSecondOne] = useState('')
    const [secondTwo, setSecondTwo] = useState('')

    const myRef1 = React.useRef(null)
    const executeScroll1 = () => myRef1.current.scrollIntoView()

    const myRef2 = React.useRef(null)
    const executeScroll2 = () => myRef2.current.scrollIntoView()

    const myRef3 = React.useRef(null)
    const executeScroll3 = () => myRef3.current.scrollIntoView()

    return (
        <div>
            <div
                style={{
                    width: 'calc(100vw - 40px)',
                    height: 'calc(340vh - 40px)',
                    overflowX: 'hidden',
                    scrollBehavior: 'smooth',
                    margin: '0',
                    padding: '20px',
                    background: 'rgba(0, 0, 0, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'column',
                }}
                ref={myRef3}>
                <div style={{ height: '60vh' }} />
                <div style={{ height: '100px' }} />
                <div style={{ textAlign: 'center', color: 'white' }}>
                    <Typography use='headline2'>IASA CLUB</Typography>
                    <br />
                    <br />
                    <Typography use='headline4'>
                        인천과학예술영재학교 동아리 신청
                    </Typography>
                    <br />
                    <br />
                    <div>
                        <Grid>
                            <GridCell span={6}>
                                <Button
                                    outlined
                                    style={
                                        {
                                            '--mdc-theme-primary': 'white',
                                            borderColor: 'white',
                                            padding: '20px',
                                            fontSize: '20px',
                                        } as React.CSSProperties
                                    }
                                    onClick={executeScroll1}>
                                    제1동아리 보러가기
                                </Button>
                            </GridCell>
                            <GridCell span={6}>
                                <Button
                                    outlined
                                    style={
                                        {
                                            '--mdc-theme-primary': 'white',
                                            borderColor: 'white',
                                            padding: '20px',
                                            fontSize: '20px',
                                        } as React.CSSProperties
                                    }
                                    onClick={executeScroll2}>
                                    제2동아리 보러가기
                                </Button>
                            </GridCell>
                        </Grid>
                    </div>
                    <Typography use='headline6'>
                        아래의 버튼을 통해 신청해주세요.
                    </Typography>
                    <br />
                    <Typography use='headline6'>
                        신청 후 확인 버튼을 눌러 접수 상태를 꼭 확인해주세요.
                    </Typography>
                    <br />
                    <br />
                    <Button
                        outlined
                        style={
                            {
                                '--mdc-theme-primary': 'white',
                                borderColor: 'white',
                                padding: '20px',
                                fontSize: '20px',
                            } as React.CSSProperties
                        }
                        onClick={() => {
                            setDialogOpen(true)
                        }}>
                        신청하기
                    </Button>
                    <br />
                    <br />
                    <Button
                        outlined
                        style={
                            {
                                '--mdc-theme-primary': 'white',
                                borderColor: 'white',
                                padding: '20px',
                                fontSize: '20px',
                            } as React.CSSProperties
                        }
                        onClick={() => {
                            setCheckOpen(true)
                        }}>
                        신청확인
                    </Button>
                    <div style={{ height: '45vh' }} />
                </div>
                <div style={{ height: '1px' }} ref={myRef1} />
                <Button
                    outlined
                    style={
                        {
                            '--mdc-theme-primary': 'white',
                            borderColor: 'white',
                            padding: '10px',
                            fontSize: '20px',
                            width: '30px',
                        } as React.CSSProperties
                    }
                    onClick={executeScroll3}>
                    ︿
                </Button>
                <div style={{ height: '2vh' }} />
                <Slide num='1' />
                <div style={{ height: '2vh' }} />
                <Button
                    outlined
                    style={
                        {
                            '--mdc-theme-primary': 'white',
                            borderColor: 'white',
                            padding: '10px',
                            fontSize: '20px',
                            width: '30px',
                        } as React.CSSProperties
                    }
                    onClick={executeScroll2}>
                    ﹀
                </Button>
                <div style={{ height: '80vh' }} />
                <div style={{ height: '1px' }} ref={myRef2} />
                <Button
                    outlined
                    style={
                        {
                            '--mdc-theme-primary': 'white',
                            borderColor: 'white',
                            padding: '10px',
                            fontSize: '20px',
                            width: '30px',
                        } as React.CSSProperties
                    }
                    onClick={executeScroll1}>
                    ︿
                </Button>
                <div style={{ height: '2vh' }} />
                <Slide num='2' />
                <Footer />
            </div>
            <Dialog
                open={checkOpen}
                onClose={() => {
                    setCheckOpen(false)
                }}>
                <DialogTitle>신청확인(학번을 입력해주세요)</DialogTitle>
                <DialogContent>
                    <br />
                    <Grid>
                        <GridCell span={12}>
                            <GridRow>
                                <GridCell span={8} align='middle'>
                                    <TextField
                                        outlined
                                        label='학번'
                                        style={
                                            {
                                                width: '60%',
                                                height: '70%',
                                                float: 'left',
                                            } as React.CSSProperties
                                        }
                                        value={number}
                                        onChange={(e) =>
                                            setNumber(e.currentTarget.value)
                                        }
                                    />
                                </GridCell>
                                <GridCell span={4} align='middle'>
                                    <Button
                                        outlined
                                        style={
                                            {
                                                '--mdc-theme-primary': 'black',
                                                borderColor: 'black',
                                                fontSize: '20px',
                                                float: 'right',
                                            } as React.CSSProperties
                                        }
                                        onClick={() => {
                                            setIsCheck(isCheck + 1)
                                        }}>
                                        신청확인
                                    </Button>
                                </GridCell>
                            </GridRow>
                        </GridCell>
                    </Grid>

                    <ClubTable number={number} isCheck={isCheck} />
                </DialogContent>
                <DialogActions>
                    <DialogButton action='close'>확인</DialogButton>
                </DialogActions>
            </Dialog>
            <Dialog
                open={dialogOpen}
                onClose={() => {
                    setDialogOpen(false)
                }}
                onClosed={(e) => {
                    if (e.detail.action === 'accept') {
                        console.log(
                            number,
                            name,
                            firstOne,
                            firstTwo,
                            secondOne,
                            secondTwo
                        )
                        register(
                            number,
                            name,
                            firstOne,
                            firstTwo,
                            secondOne,
                            secondTwo
                        )
                    }
                }}>
                <DialogTitle>신청</DialogTitle>
                <DialogContent>
                    <Grid>
                        <GridCell span={12}>
                            <TextField
                                outlined
                                label='학번'
                                style={{ width: '100%' }}
                                onChange={(e) =>
                                    setNumber(e.currentTarget.value)
                                }
                            />
                        </GridCell>
                        <GridCell span={12}>
                            <TextField
                                outlined
                                label='학생명'
                                style={{ width: '100%' }}
                                onChange={(e) => setName(e.currentTarget.value)}
                            />
                        </GridCell>
                        <GridCell span={12}>
                            <GridRow>
                                <GridCell span={6}>
                                    <Select
                                        label='제1동아리 1지망'
                                        outlined
                                        options={firstClub}
                                        enhanced
                                        style={{
                                            width: '100%',
                                            maxHeight: '250px',
                                        }}
                                        value={firstOne}
                                        onChange={(e) =>
                                            setFirstOne(e.currentTarget.value)
                                        }
                                    />
                                </GridCell>
                                <GridCell span={6}>
                                    <Select
                                        label='제1동아리 2지망'
                                        outlined
                                        options={firstClub}
                                        enhanced
                                        style={{
                                            width: '100%',
                                            maxHeight: '250px',
                                        }}
                                        value={firstTwo}
                                        onChange={(e) =>
                                            setFirstTwo(e.currentTarget.value)
                                        }
                                    />
                                </GridCell>
                            </GridRow>
                        </GridCell>
                        <GridCell span={12}>
                            <GridRow>
                                <GridCell span={6}>
                                    <Select
                                        label='제2동아리 1지망'
                                        outlined
                                        options={secondClub}
                                        enhanced
                                        style={{
                                            width: '100%',
                                            maxHeight: '200px',
                                        }}
                                        value={secondOne}
                                        onChange={(e) =>
                                            setSecondOne(e.currentTarget.value)
                                        }
                                    />
                                </GridCell>
                                <GridCell span={6}>
                                    <Select
                                        label='제2동아리 2지망'
                                        outlined
                                        options={secondClub}
                                        enhanced
                                        style={{
                                            width: '100%',
                                            maxHeight: '200px',
                                        }}
                                        value={secondTwo}
                                        onChange={(e) =>
                                            setSecondTwo(e.currentTarget.value)
                                        }
                                    />
                                </GridCell>
                            </GridRow>
                        </GridCell>
                    </Grid>
                    <TermsOfUse />
                    <br />
                    <Checkbox
                        label='본인은 IASA PORTAL의 이용약관 및 개인정보처리방침에 대해 동의합니다.'
                        checked={agreeTerms}
                        onChange={(e) =>
                            setAgreeTerms(!!e.currentTarget.checked)
                        }
                    />
                </DialogContent>
                <DialogActions>
                    <DialogButton action='close'>취소</DialogButton>
                    <DialogButton
                        action='accept'
                        isDefaultAction
                        disabled={!agreeTerms}>
                        신청하기
                    </DialogButton>
                </DialogActions>
            </Dialog>

            <SnackbarQueue messages={messages} />
        </div>
    )
}

export default withRouter(About)
