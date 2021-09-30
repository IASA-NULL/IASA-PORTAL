import * as React from 'react'
import { useState } from 'react'
import { Link, withRouter } from 'react-router-dom'

import { Typography } from '@rmwc/typography'
import {
    TopAppBar,
    TopAppBarRow,
    TopAppBarSection,
    TopAppBarTitle,
} from '@rmwc/top-app-bar'
import { Button } from '@rmwc/button'
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
import { Checkbox } from '@rmwc/checkbox'
import { createSnackbarQueue, SnackbarQueue } from '@rmwc/snackbar'

import { fetchAPI } from '../../util'
import { useSpring, animated } from 'react-spring'
import TermsOfUse from '../typography/TermsOfUse'
import Footer from '../typography/Footer'

const calc = (x: number, y: number) => [
    x - window.innerWidth / 2,
    y - window.innerHeight / 2,
]
const trans1 = (x: number, y: number) =>
    `translate3d(${x / 10 - 5 - 130}px,${y / 10 - 5 - 130}px,0)`
const trans2 = (x: number, y: number) =>
    `translate3d(${x / 8 - 45 - 130}px,${y / 8 + 34 - 130}px,0)`
const trans3 = (x: number, y: number) =>
    `translate3d(${x / 6 - 3 - 130}px,${y / 6 - 3 - 130}px,0)`

let qu = createSnackbarQueue()
let messages = qu.messages
let notify = qu.notify

function register(name: string, call: string) {
    fetchAPI('POST', { name, call }, 'busking')
        .then((res) => {
            if (res.success) {
                notify({
                    title: <b style={{ fontSize: '15px' }}>신청알림</b>,
                    body: (
                        <div>
                            버스킹에 성공적으로 등록했습니다. 사이언스버스킹
                            접수자 명단은
                            <br />
                            인천과학예술영재학교 홈페이지 공지사항에서 확인
                            가능합니다.
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

function length() {
    fetchAPI('GET', {}, 'busking', 'check')
        .then((res) => {
            if (!res.success) {
                notify({
                    title: <b>신청알림</b>,
                    body: res.message,
                    icon: 'error_outline',
                    dismissIcon: true,
                })
            } else {
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

function About() {
    const [agreeTerms, setAgreeTerms] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [listOpen, setListOpen] = useState(false)

    const [name, setName] = useState('')
    const [call, setCall] = useState('')

    let applyDate =
        new Date(Date.now()) < new Date(2021, 5 - 1, 16, 23, 59, 59)
            ? new Date(2021, 5 - 1, 12, 13, 0, 0)
            : new Date(Date.now()) < new Date(2021, 6 - 1, 13, 23, 59, 59)
            ? new Date(2021, 6 - 1, 9, 13, 0, 0)
            : new Date(2021, 8 - 1, 25, 13, 0, 0)

    let playDate =
        new Date(Date.now()) < new Date(2021, 5 - 1, 16, 23, 59, 59)
            ? new Date(2021, 5 - 1, 12, 13, 15, 0)
            : new Date(Date.now()) < new Date(2021, 6 - 1, 13, 23, 59, 59)
            ? new Date(2021, 6 - 1, 12, 0, 0, 0)
            : new Date(2021, 8 - 1, 26, 13, 15, 0)

    let whatNumber =
        new Date(Date.now()) < new Date(2021, 5 - 1, 16, 23, 59, 59)
            ? [1, 5, 12]
            : new Date(Date.now()) < new Date(2021, 6 - 1, 13, 23, 59, 59)
            ? [2, 6, 9]
            : [3, 8, 25]

    const [props, set] = useSpring(() => ({
        xy: [0, 0],
        config: { mass: 10, tension: 550, friction: 140 },
    }))

    return (
        <div
            onMouseMove={({ clientX: x, clientY: y }) =>
                set({ xy: calc(x, y) })
            }>
            <TopAppBar fixed style={{ zIndex: 10 }} className='transparent'>
                <TopAppBarRow>
                    <TopAppBarSection alignStart>
                        <TopAppBarTitle>
                            <Link
                                to='/about'
                                style={{
                                    textDecoration: 'none',
                                    color: 'white',
                                }}>
                                IASA Portal
                            </Link>
                        </TopAppBarTitle>
                    </TopAppBarSection>
                </TopAppBarRow>
            </TopAppBar>
            <animated.img
                src='/static/img/busking/3.png'
                style={{
                    width: '120vw',
                    height: '120vh',
                    margin: '0',
                    padding: '0',
                    position: 'fixed',
                    objectFit: 'cover',
                    transform: props.xy.interpolate(trans3),
                }}
            />
            <animated.img
                src='/static/img/busking/2.png'
                style={{
                    width: '120vw',
                    height: '120vh',
                    margin: '0',
                    padding: '0',
                    position: 'fixed',
                    objectFit: 'cover',
                    transform: props.xy.interpolate(trans2),
                }}
            />
            <animated.img
                src='/static/img/busking/1.png'
                style={{
                    width: '120vw',
                    height: '120vh',
                    margin: '0',
                    padding: '0',
                    position: 'fixed',
                    objectFit: 'cover',
                    transform: props.xy.interpolate(trans1),
                }}
            />
            <div
                style={{
                    width: 'calc(100vw - 40px)',
                    height: 'calc(100vh - 40px)',
                    margin: '0',
                    padding: '20px',
                    position: 'fixed',
                    background: 'rgba(0, 0, 0, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'column',
                }}>
                <div style={{ height: '100px' }} />
                <div style={{ textAlign: 'center', color: 'white' }}>
                    <Typography use='headline2'>
                        IASA SCIENCE BUSKING
                    </Typography>
                    <br />
                    <br />
                    <Typography use='headline4'>
                        인천과학예술영재학교 사이언스 버스킹
                    </Typography>
                    <br />
                    <br />
                    {(() => {
                        if (new Date(Date.now()) < playDate) {
                            return (
                                <>
                                    <Typography use='headline6'>
                                        사이언스 버스킹 {whatNumber[0]}회차
                                        신청은 {whatNumber[1]}/{whatNumber[2]}
                                        (수) 13시부터 접수 가능합니다.
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
                                            if (
                                                new Date(Date.now()) < applyDate
                                            ) {
                                                notify({
                                                    title: <b>신청알림</b>,
                                                    body: `${whatNumber[0]}회차 신청은 ${whatNumber[1]}/${whatNumber[2]}(수) 13시부터 접수 가능합니다.`,
                                                    icon: 'error_outline',
                                                    dismissIcon: true,
                                                })
                                            } else {
                                                fetchAPI(
                                                    'GET',
                                                    {},
                                                    'busking',
                                                    'check'
                                                )
                                                    .then((res) => {
                                                        if (!res.success) {
                                                            notify({
                                                                title: (
                                                                    <b
                                                                        style={{
                                                                            fontSize:
                                                                                '15px',
                                                                        }}>
                                                                        신청알림
                                                                    </b>
                                                                ),
                                                                body: (
                                                                    <div>
                                                                        신청이
                                                                        마감되었습니다.
                                                                        체험꾸러미가
                                                                        없어도
                                                                        누구나
                                                                        ZOOM
                                                                        참관은
                                                                        가능합니다.
                                                                        <br />
                                                                        <br />
                                                                        <Button
                                                                            outlined
                                                                            style={
                                                                                {
                                                                                    '--mdc-theme-primary':
                                                                                        'white',
                                                                                    borderColor:
                                                                                        'white',
                                                                                    padding:
                                                                                        '10px 15px',
                                                                                    fontSize:
                                                                                        '15px',
                                                                                    float:
                                                                                        'right',
                                                                                } as React.CSSProperties
                                                                            }
                                                                            onClick={() => {
                                                                                setListOpen(
                                                                                    true
                                                                                )
                                                                            }}>
                                                                            확인하기
                                                                        </Button>
                                                                    </div>
                                                                ),
                                                                icon:
                                                                    'error_outline',
                                                                dismissIcon: true,
                                                            })
                                                        } else {
                                                            setDialogOpen(true)
                                                        }
                                                    })
                                                    .catch(() => {
                                                        notify({
                                                            title: <b>오류</b>,
                                                            body:
                                                                '서버와 연결할 수 없어요.',
                                                            icon:
                                                                'error_outline',
                                                            dismissIcon: true,
                                                        })
                                                    })
                                            }
                                        }}>
                                        신청하기
                                    </Button>
                                </>
                            )
                        } else {
                            return (
                                <>
                                    <Typography use='headline6'>
                                        사이언스 버스킹 {whatNumber[0]}회차
                                        신청이 마감되었습니다.
                                    </Typography>
                                    <br />
                                    <br />
                                    <Typography use='headline6'>
                                        체험꾸러미가 없어도 누구나 ZOOM 참관은
                                        가능합니다.
                                    </Typography>
                                    <br />
                                    <Typography use='headline6'>
                                        일정은 아래 버튼을 통해 참고해주세요.
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
                                            setListOpen(true)
                                        }}>
                                        확인하기
                                    </Button>
                                </>
                            )
                        }
                    })()}
                </div>
                <Footer />
            </div>
            <Dialog
                open={dialogOpen}
                onClose={() => {
                    setDialogOpen(false)
                }}
                onClosed={(e) => {
                    if (e.detail.action === 'accept') {
                        register(name, call)
                    }
                }}>
                <DialogTitle>신청</DialogTitle>
                <DialogContent>
                    <br />
                    <TextField
                        outlined
                        label='학생명'
                        style={{ width: '100%' }}
                        value={name}
                        onChange={(e) => setName(e.currentTarget.value)}
                    />
                    <br />
                    <br />
                    <TextField
                        outlined
                        label='연락처'
                        style={{ width: '100%' }}
                        value={call}
                        onChange={(e) => setCall(e.currentTarget.value)}
                    />
                    <br />
                    <br />
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
            <Dialog
                open={listOpen}
                onClose={() => {
                    setListOpen(false)
                }}>
                <DialogTitle>8/29(일) 사이언스 버스킹 3회차 일정</DialogTitle>
                <DialogContent>
                    <DataTable>
                        <DataTableContent>
                            <DataTableHead>
                                <DataTableHeadCell alignMiddle>
                                    체험
                                </DataTableHeadCell>
                                <DataTableHeadCell alignMiddle>
                                    ZOOM 회의 ID
                                </DataTableHeadCell>
                                <DataTableHeadCell alignMiddle>
                                    PassWord
                                </DataTableHeadCell>
                            </DataTableHead>
                            <DataTableBody>
                                <DataTableRow>
                                    <DataTableCell alignMiddle>
                                        체험A(로봇)
                                    </DataTableCell>
                                    <DataTableCell alignMiddle>
                                        227 077 3235
                                    </DataTableCell>
                                    <DataTableCell alignMiddle>
                                        6700
                                    </DataTableCell>
                                </DataTableRow>
                                <DataTableRow>
                                    <DataTableCell alignMiddle>
                                        체험B(과학완구)
                                    </DataTableCell>
                                    <DataTableCell alignMiddle>
                                        <del>892 9757 8646</del>
                                        <br />
                                        <div style={{ color: '#39389f' }}>
                                            826 5625 7272(변경)
                                        </div>
                                    </DataTableCell>
                                    <DataTableCell alignMiddle>
                                        6700
                                    </DataTableCell>
                                </DataTableRow>
                                <DataTableRow>
                                    <DataTableCell alignMiddle>
                                        체험C(비행체)
                                    </DataTableCell>
                                    <DataTableCell alignMiddle>
                                        861 9773 5238
                                    </DataTableCell>
                                    <DataTableCell alignMiddle>
                                        6700
                                    </DataTableCell>
                                </DataTableRow>
                                <DataTableRow>
                                    <DataTableCell alignMiddle>
                                        체험D(체험수학)
                                    </DataTableCell>
                                    <DataTableCell alignMiddle>
                                        293 475 8580
                                    </DataTableCell>
                                    <DataTableCell alignMiddle>
                                        6700
                                    </DataTableCell>
                                </DataTableRow>
                            </DataTableBody>
                        </DataTableContent>
                    </DataTable>
                    <br />
                    <br />
                    <br />
                    <DataTable style={{ height: '270px', width: '365px' }}>
                        <DataTableContent>
                            <DataTableHead>
                                <DataTableHeadCell alignMiddle>
                                    회차
                                </DataTableHeadCell>
                                <DataTableHeadCell alignMiddle>
                                    시간
                                </DataTableHeadCell>
                            </DataTableHead>
                            <DataTableBody>
                                <DataTableRow>
                                    <DataTableCell alignMiddle>1</DataTableCell>
                                    <DataTableCell alignMiddle>
                                        15:00 ~ 15:25
                                    </DataTableCell>
                                </DataTableRow>
                                <DataTableRow>
                                    <DataTableCell alignMiddle>2</DataTableCell>
                                    <DataTableCell alignMiddle>
                                        15:30 ~ 15:55
                                    </DataTableCell>
                                </DataTableRow>
                                <DataTableRow>
                                    <DataTableCell alignMiddle>3</DataTableCell>
                                    <DataTableCell alignMiddle>
                                        16:00 ~ 16:25
                                    </DataTableCell>
                                </DataTableRow>
                                <DataTableRow>
                                    <DataTableCell alignMiddle>4</DataTableCell>
                                    <DataTableCell alignMiddle>
                                        16:30 ~ 16:55
                                    </DataTableCell>
                                </DataTableRow>
                            </DataTableBody>
                        </DataTableContent>
                    </DataTable>
                </DialogContent>
                <DialogActions>
                    <DialogButton action='close'>확인</DialogButton>
                </DialogActions>
            </Dialog>
            <SnackbarQueue messages={messages} />
        </div>
    )
}

export default withRouter(About)
