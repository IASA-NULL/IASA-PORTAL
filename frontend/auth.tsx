import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { ThemeProvider } from '@rmwc/theme'
import { IconButton } from '@rmwc/icon-button'
import { LinearProgress } from '@rmwc/linear-progress'
import { Menu, MenuItem, MenuSurfaceAnchor } from '@rmwc/menu'
import { Typography } from '@rmwc/typography'
import { Button } from '@rmwc/button'

import 'rmwc/dist/styles'
import '@rmwc/list/collapsible-list.css'
import '@material/list/dist/mdc.list.css'

import { darkTheme, fetchAPI, isDarkTheme, LinkType, MenuLink } from './util'

import { IdForm, PasswordForm, ReqChangePassword } from './account/signin'
import { FindID, FindPassword, FoundId, FoundPassword } from './account/find'
import {
    SignupCode,
    SignupFill1,
    SignupFill2,
    SignupFin,
    SignupTerms,
} from './account/signup'
import { Permission } from '../scheme/api/auth'
import ChangeSecret from './account/changesecret'
import createURL from '../scheme/url'
import { lightTheme } from './util'

const loginStateUpdate = new Event('loginStateUpdate')

let accountInfo: any

interface IState {
    loaded: boolean
    showLangOp: boolean
    showTerm: boolean
    formList: JSX.Element[]
    currentPage: number
    errMessage: string
    title: {
        main: string
        sub: string
        id: string
    }[]

    id: string
    password: string

    signupType: Permission
    signupCode: string

    signup_id: string
    signup_password: string
    signup_passwordConfirm: string
    signup_email: string

    findid_email: string
    findid_name: string

    findpass_email: string

    changepass_password: string
    changepass_passwordConfirm: string
}

class App extends React.Component<any, IState> {
    public async componentDidMount() {
        let isMobile =
            window.matchMedia('(max-width: 550px)').matches ||
            window.matchMedia('(max-height: 650px)').matches
        let context = {
            get: this.getSt.bind(this),
            set: this.setSt.bind(this),
        }
        if (window.location.pathname.split('/').pop() === 'signin') {
            if (accountInfo.data.permission !== Permission.none)
                this.moveToLink()
            this.setState({
                formList: [
                    <IdForm
                        setState={this.setState}
                        isMobile={isMobile}
                        next={this.getIdInfo(
                            <PasswordForm
                                setState={this.setState}
                                isMobile={isMobile}
                                find={this.next(
                                    <FindPassword
                                        setState={this.setState}
                                        isMobile={isMobile}
                                        context={context}
                                        next={this.findPass(
                                            <FoundPassword
                                                setState={this.setState}
                                                isMobile={isMobile}
                                                context={context}
                                                next={this.resetForm()}
                                            />
                                        )}
                                    />,
                                    '비밀번호 찾기',
                                    '이메일을 입력하세요.',
                                    'FindPassword'
                                )}
                                context={context}
                                next={this.signin(
                                    <ReqChangePassword
                                        setState={this.setState}
                                        isMobile={isMobile}
                                        context={context}
                                        next={this.moveToLink}
                                    />
                                )}
                            />
                        )}
                        find={this.next(
                            <FindID
                                setState={this.setState}
                                isMobile={isMobile}
                                context={context}
                                next={this.findId(
                                    <FoundId
                                        setState={this.setState}
                                        isMobile={isMobile}
                                        context={context}
                                        next={this.resetForm()}
                                    />
                                )}
                            />,
                            '아이디 찾기',
                            '이메일을 입력하세요.',
                            'FindID'
                        )}
                        create={this.next(
                            <SignupCode
                                setState={this.setState}
                                isMobile={isMobile}
                                context={context}
                                next={this.getCodeInfo(
                                    <SignupFill1
                                        setState={this.setState}
                                        isMobile={isMobile}
                                        context={context}
                                        next={this.validateSignup1(
                                            <SignupFill2
                                                setState={this.setState}
                                                isMobile={isMobile}
                                                context={context}
                                                next={this.validateSignup2(
                                                    <SignupTerms
                                                        isMobile={isMobile}
                                                        context={context}
                                                        next={this.submitSignup(
                                                            <SignupFin
                                                                isMobile={
                                                                    isMobile
                                                                }
                                                                next={this.resetForm()}
                                                            />
                                                        )}
                                                    />
                                                )}
                                            />
                                        )}
                                    />
                                )}
                            />,
                            '가입하기',
                            '계속하려면 NULL에 개인별로 부여되는 코드를 요청하세요.',
                            'SignupCode'
                        )}
                        context={context}
                    />,
                ],
                currentPage: 0,
                title: [
                    { main: '로그인', sub: 'IASA PORTAL로 계속', id: 'IdForm' },
                ],
            })
        } else if (
            window.location.pathname.split('/').reverse()[1] === 'changesecret'
        ) {
            this.setState({
                formList: [
                    <ChangeSecret
                        setState={this.setState}
                        isMobile={isMobile}
                        context={context}
                        next={this.changePass()}
                    />,
                ],
                currentPage: 0,
                title: [
                    {
                        main: '비밀번호 변경',
                        sub: '6자 이상의 숫자/영어/특수문자로 설정하세요.',
                        id: 'ChangeSecret',
                    },
                ],
            })
        } else if (window.location.pathname.split('/').pop() === 'challenge') {
            this.setState({
                formList: [
                    <PasswordForm
                        setState={this.setState}
                        isMobile={isMobile}
                        find={this.next(
                            <FindPassword
                                setState={this.setState}
                                isMobile={isMobile}
                                context={context}
                                next={this.findPass(
                                    <FoundPassword
                                        setState={this.setState}
                                        isMobile={isMobile}
                                        context={context}
                                        next={this.resetForm()}
                                    />
                                )}
                            />,
                            '비밀번호 찾기',
                            '이메일을 입력하세요.',
                            'FindPassword'
                        )}
                        context={context}
                        next={this.sudo(
                            <ReqChangePassword
                                setState={this.setState}
                                isMobile={isMobile}
                                context={context}
                                next={this.moveToLink}
                            />
                        )}
                    />,
                ],
                currentPage: 0,
                title: [
                    {
                        main: `안녕하세요, ${accountInfo.data.name}님.`,
                        sub: '계속하려면 비밀번호를 입력하세요.',
                        id: 'PasswordForm',
                    },
                ],
                id: accountInfo.data.id,
            })
        }
        setTimeout(() => {
            this.setState({ loaded: true })
            window.dispatchEvent(
                new CustomEvent('focusFrame', {
                    detail: { frame: this.state?.title[0].id },
                })
            )
        }, 300)
    }

    public getSt(key: string) {
        if (!this.state) return undefined
        // @ts-ignore
        return this.state[key]
    }

    public setSt(key: string, value: any) {
        // @ts-ignore
        this.setState({ [key]: value })
    }

    public next(
        form: JSX.Element,
        mainTitle: string,
        subTitle: string,
        formId: string
    ) {
        return () => {
            this.setState({ loaded: true, errMessage: '' })
            if (this.state.formList.length > this.state.currentPage + 1) {
                this.setState({
                    formList: [
                        ...this.state.formList.slice(
                            0,
                            this.state.currentPage + 1
                        ),
                        form,
                    ],
                    title: [
                        ...this.state.title.slice(
                            0,
                            this.state.currentPage + 1
                        ),
                        {
                            main: mainTitle,
                            sub: subTitle,
                            id: formId,
                        },
                    ],
                })
            } else {
                this.setState({
                    formList: [...this.state.formList, form],
                    title: [
                        ...this.state.title,
                        {
                            main: mainTitle,
                            sub: subTitle,
                            id: formId,
                        },
                    ],
                })
            }
            this.setState({ currentPage: this.state.currentPage + 1 })
            setTimeout(() => {
                window.dispatchEvent(
                    new CustomEvent('focusFrame', { detail: { frame: formId } })
                )
            }, 300)
        }
    }

    public focusCurrentInput() {
        setTimeout(() => {
            window.dispatchEvent(
                new CustomEvent('focusFrame', {
                    detail: {
                        frame: this.state?.title[this.state?.currentPage].id,
                    },
                })
            )
        }, 300)
    }

    public getIdInfo(form: JSX.Element) {
        return () => {
            this.setState({ errMessage: '' })
            if (this.state?.id) {
                this.setState({ loaded: false })
                fetchAPI(
                    'POST',
                    {
                        id: this.state?.id,
                    },
                    'account',
                    'username'
                )
                    .then((res) => {
                        if (res.success) {
                            this.next(
                                form,
                                `${res.data}님, 안녕하세요.`,
                                '비밀번호를 입력해서 로그인',
                                'PasswordForm'
                            )()
                        } else {
                            this.setState({
                                errMessage: res.message,
                                loaded: true,
                            })
                            this.focusCurrentInput()
                        }
                    })
                    .catch(() => {
                        this.setState({
                            errMessage: '서버와 통신 중 오류가 발생했어요.',
                            loaded: true,
                        })
                        this.focusCurrentInput()
                    })
            } else {
                this.setState({ errMessage: '아이디를 입력하세요.' })
                this.focusCurrentInput()
            }
        }
    }

    public getCodeInfo(form: JSX.Element) {
        return () => {
            this.setState({ errMessage: '' })
            if (this.state?.signupCode) {
                this.setState({ loaded: false })
                fetchAPI(
                    'POST',
                    {
                        code: this.state?.signupCode,
                        type: this.state?.signupType,
                    },
                    'account',
                    'signup',
                    'verify'
                )
                    .then((res) => {
                        if (res.success) {
                            this.next(
                                form,
                                '가입하기',
                                '아래 내용을 채우세요.',
                                'SignupFill1'
                            )()
                        } else {
                            this.setState({
                                errMessage: res.message,
                                loaded: true,
                            })
                            this.focusCurrentInput()
                        }
                    })
                    .catch(() => {
                        this.setState({
                            errMessage: '서버와 통신 중 오류가 발생했어요.',
                            loaded: true,
                        })
                        this.focusCurrentInput()
                    })
            } else {
                this.setState({ errMessage: '코드를 입력하세요.' })
                this.focusCurrentInput()
            }
        }
    }

    public signin(form: JSX.Element) {
        return () => {
            this.setState({ errMessage: '' })
            if (this.state?.password) {
                this.setState({ loaded: false })
                fetchAPI(
                    'POST',
                    {
                        id: this.state?.id,
                        password: this.state?.password,
                    },
                    'account',
                    'signin'
                )
                    .then((res) => {
                        if (res.success) {
                            if (res.data.requestChangePW)
                                this.next(
                                    form,
                                    '비밀번호 변경',
                                    '3개월마다 비밀번호를 변경하는 것이 좋아요.',
                                    'reqChangePassword'
                                )()
                            else this.moveToLink()
                        } else {
                            this.setState({
                                errMessage: res.message,
                                loaded: true,
                            })
                            this.focusCurrentInput()
                        }
                    })
                    .catch(() => {
                        this.setState({
                            errMessage: '서버와 통신 중 오류가 발생했어요.',
                            loaded: true,
                        })
                        this.focusCurrentInput()
                    })
            } else {
                this.setState({ errMessage: '비밀번호를 입력하세요.' })
                this.focusCurrentInput()
            }
        }
    }

    public sudo(form: JSX.Element) {
        return () => {
            this.setState({ errMessage: '' })
            if (this.state?.password) {
                this.setState({ loaded: false })
                fetchAPI(
                    'POST',
                    {
                        id: this.state?.id,
                        password: this.state?.password,
                    },
                    'account',
                    'sudo'
                )
                    .then((res) => {
                        if (res.success) {
                            if (res.data.requestChangePW)
                                this.next(
                                    form,
                                    '비밀번호 변경',
                                    '3개월마다 비밀번호를 변경하는 것이 좋아요.',
                                    'reqChangePassword'
                                )()
                            else this.moveToLink()
                        } else {
                            this.setState({
                                errMessage: res.message,
                                loaded: true,
                            })
                            this.focusCurrentInput()
                        }
                    })
                    .catch(() => {
                        this.setState({
                            errMessage: '서버와 통신 중 오류가 발생했어요.',
                            loaded: true,
                        })
                        this.focusCurrentInput()
                    })
            } else {
                this.setState({ errMessage: '비밀번호를 입력하세요.' })
                this.focusCurrentInput()
            }
        }
    }

    public changePass() {
        return () => {
            this.setState({ errMessage: '' })
            if (
                this.state?.changepass_password &&
                this.state?.changepass_passwordConfirm
            ) {
                if (
                    this.state?.changepass_password !==
                    this.state?.changepass_passwordConfirm
                ) {
                    this.setState({ errMessage: '비밀번호가 같지 않아요.' })
                    this.focusCurrentInput()
                    return
                }

                const rePass = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,20}$/
                if (!rePass.test(this.state?.changepass_password)) {
                    this.setState({
                        errMessage: '비밀번호가 규칙에 맞지 않아요.',
                    })
                    this.focusCurrentInput()
                    return
                }

                this.setState({ loaded: false })
                fetchAPI(
                    'POST',
                    {
                        token: window.location.pathname.split('/').reverse()[0],
                        password: this.state?.changepass_password,
                    },
                    'account',
                    'changesecret'
                )
                    .then((res) => {
                        if (res.success) {
                            this.moveToLink()
                        } else {
                            this.setState({
                                errMessage: res.message,
                                loaded: true,
                            })
                            this.focusCurrentInput()
                        }
                    })
                    .catch(() => {
                        this.setState({
                            errMessage: '서버와 통신 중 오류가 발생했어요.',
                            loaded: true,
                        })
                        this.focusCurrentInput()
                    })
            } else {
                this.setState({ errMessage: '비밀번호를 입력하세요.' })
                this.focusCurrentInput()
            }
        }
    }

    public moveToLink() {
        const searchParams = new URLSearchParams(window.location.search)
        try {
            const next = searchParams.get('next')
            if (next) {
                window.location.replace(atob(next))
            } else throw new Error()
        } catch (e) {
            window.location.replace('/')
        }
    }

    public validateSignup1(form: JSX.Element) {
        return () => {
            this.setState({ errMessage: '' })
            if (!this.state?.signup_id || !this.state?.signup_email) {
                this.setState({ errMessage: '내용을 모두 입력하세요.' })
                this.focusCurrentInput()
                return
            }
            const reMail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            const reId = /^[a-z0-9]{4,20}$/g

            if (!reId.test(this.state?.signup_id)) {
                this.setState({
                    errMessage: '아이디는 4-20자 소문자/숫자여야 해요.',
                })
                this.focusCurrentInput()
                return
            }

            if (!reMail.test(String(this.state?.signup_email).toLowerCase())) {
                this.setState({ errMessage: '이메일이 올바르지 않아요.' })
                this.focusCurrentInput()
                return
            }
            this.next(
                form,
                '비밀번호 설정',
                '6자 이상의 숫자/영어/특수문자로 설정하세요.',
                'SignupFill2'
            )()
        }
    }

    public validateSignup2(form: JSX.Element) {
        return () => {
            this.setState({ errMessage: '' })
            if (
                !this.state?.signup_password ||
                !this.state?.signup_passwordConfirm
            ) {
                this.setState({ errMessage: '내용을 모두 입력하세요.' })
                this.focusCurrentInput()
                return
            }
            if (
                this.state?.signup_password !==
                this.state?.signup_passwordConfirm
            ) {
                this.setState({ errMessage: '비밀번호가 같지 않아요.' })
                this.focusCurrentInput()
                return
            }

            const rePass = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,20}$/
            if (!rePass.test(this.state?.signup_password)) {
                this.setState({ errMessage: '비밀번호가 규칙에 맞지 않아요.' })
                this.focusCurrentInput()
                return
            }

            this.next(
                form,
                '약관 확인',
                '계속하려면 IASA PORTAL의 약관에 동의하세요.',
                'SignupTerms'
            )()
        }
    }

    public submitSignup(form: JSX.Element) {
        return () => {
            this.setState({ loaded: false })
            fetchAPI(
                'POST',
                {
                    code: this.state?.signupCode,
                    type: this.state?.signupType,
                    id: this.state?.signup_id,
                    password: this.state?.signup_password,
                    email: this.state?.signup_email,
                },
                'account',
                'signup',
                'mail'
            )
                .then((res) => {
                    this.setState({ loaded: true })
                    if (res.success) {
                        this.next(
                            form,
                            '메일함 확인',
                            '메일으로 전송된 가입 링크를 클릭하세요.',
                            'SignupFin'
                        )()
                    } else {
                        this.setState({ errMessage: res.message })
                        this.focusCurrentInput()
                    }
                })
                .catch(() => {
                    this.setState({
                        errMessage: '서버와 통신 중 오류가 발생했어요.',
                        loaded: true,
                    })
                    this.focusCurrentInput()
                })
        }
    }

    public resetForm() {
        return () => {
            this.next(
                this.state?.formList[0],
                this.state?.title[0].main,
                this.state?.title[0].sub,
                this.state?.title[0].id
            )()
            this.toFirst()
        }
    }

    public findId(form: JSX.Element) {
        return () => {
            this.setState({ errMessage: '' })
            if (this.state?.findid_email && this.state?.findid_name) {
                this.setState({ loaded: false })
                fetchAPI(
                    'POST',
                    {
                        email: this.state?.findid_email,
                        name: this.state?.findid_name,
                    },
                    'account',
                    'find',
                    'id'
                )
                    .then((res) => {
                        if (res.success) {
                            this.next(
                                form,
                                '아이디 찾기',
                                `회원님의 아이디는 ${res.data.id} 에요.`,
                                'FindID'
                            )()
                        } else {
                            this.setState({
                                errMessage: res.message,
                                loaded: true,
                            })
                            this.focusCurrentInput()
                        }
                    })
                    .catch(() => {
                        this.setState({
                            errMessage: '서버와 통신 중 오류가 발생했어요.',
                            loaded: true,
                        })
                        this.focusCurrentInput()
                    })
            } else {
                this.setState({ errMessage: '내용을 모두 입력하세요.' })
                this.focusCurrentInput()
            }
        }
    }

    public findPass(form: JSX.Element) {
        return () => {
            this.setState({ errMessage: '' })
            if (this.state?.findpass_email) {
                this.setState({ loaded: false })
                fetchAPI(
                    'POST',
                    {
                        email: this.state?.findpass_email,
                        id: this.state?.id,
                    },
                    'account',
                    'find',
                    'password'
                )
                    .then((res) => {
                        if (res.success) {
                            this.next(
                                form,
                                '비밀번호 찾기',
                                `메일이 맞다면 비밀번호 초기화 메일을 받을거에요.`,
                                'FindPassword'
                            )()
                        } else {
                            this.setState({
                                errMessage: res.message,
                                loaded: true,
                            })
                            this.focusCurrentInput()
                        }
                    })
                    .catch(() => {
                        this.setState({
                            errMessage: '서버와 통신 중 오류가 발생했어요.',
                            loaded: true,
                        })
                        this.focusCurrentInput()
                    })
            } else {
                this.setState({ errMessage: '이메일을 입력하세요.' })
                this.focusCurrentInput()
            }
        }
    }

    public toFirst() {
        setTimeout(() => {
            document
                .querySelector('.signin-formlist')
                .classList.remove('signin-animate')
            setTimeout(() => {
                this.setState({
                    formList: [this.state?.formList[0]],
                    title: [this.state?.title[0]],
                    currentPage: 0,
                })
                setTimeout(() => {
                    document
                        .querySelector('.signin-formlist')
                        .classList.add('signin-animate')

                    window.dispatchEvent(
                        new CustomEvent('focusFrame', {
                            detail: { frame: 'IdForm' },
                        })
                    )
                }, 0)
            }, 0)
        }, 300)
    }

    public render() {
        let theme
        if (isDarkTheme()) {
            theme = darkTheme
            document.getElementById('app').classList.add('dark')
        } else theme = lightTheme

        let commonStyle = {
            overflowX: 'hidden',
            margin: '0',
            padding: '0',
            position: 'relative',
        }
        let mobileCont = {
                ...commonStyle,
                ...{
                    width: '100%',
                    height: 'calc(100% - 84px)',
                },
            },
            desktopCont = {
                ...commonStyle,
                ...{
                    width: '500px',
                    height: '600px',
                    border: '1px solid #bbbbbb',
                    borderRadius: '5px',
                },
            }

        let isMobile =
            window.matchMedia('(max-width: 550px)').matches ||
            window.matchMedia('(max-height: 650px)').matches

        window.dispatchEvent(loginStateUpdate)

        return (
            <ThemeProvider options={theme}>
                <div
                    style={{
                        display: 'flex',
                        width: '100vw',
                        height: '100vh',
                        padding: '0',
                        margin: '0',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    <div
                        style={
                            isMobile
                                ? {
                                      width: '100%',
                                      height: '100%',
                                  }
                                : {
                                      width: '500px',
                                      height: '600px',
                                  }
                        }>
                        <div
                            style={
                                isMobile
                                    ? (mobileCont as React.CSSProperties)
                                    : (desktopCont as React.CSSProperties)
                            }>
                            <LinearProgress
                                style={{
                                    opacity: this.state?.loaded ? '0' : '1',
                                    transition: 'opacity 0.5s',
                                }}
                            />
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '100%',
                                    height: '100%',
                                    position: 'absolute',
                                    top: '0',
                                }}>
                                <div
                                    style={{
                                        textAlign: 'center',
                                        width: '100%',
                                    }}>
                                    <img
                                        src='/static/img/logo.jpg'
                                        style={{ width: '80px' }}
                                        alt='Logo'
                                    />
                                    <br />
                                    <br />
                                    <Typography use='headline4'>
                                        {
                                            (this.state?.title ?? [])[
                                                this.state?.currentPage ?? 0
                                            ]?.main
                                        }
                                    </Typography>
                                    <br />
                                    <br />
                                    <Typography use='subtitle1'>
                                        {
                                            (this.state?.title ?? [])[
                                                this.state?.currentPage ?? 0
                                            ]?.sub
                                        }
                                    </Typography>
                                    <br />
                                    <br />
                                    <br />
                                    <div
                                        className='signin-formlist signin-animate'
                                        style={{
                                            position: 'relative',
                                            width: `30000px`,
                                            left: `-${
                                                this.state?.currentPage * 100
                                            }%`,
                                            maxHeight: '350px',
                                            overflowY: 'scroll',
                                        }}>
                                        {this.state?.formList}
                                    </div>
                                </div>
                            </div>
                            <IconButton
                                icon='arrow_back'
                                style={{
                                    margin: '10px',
                                    top: '0',
                                    position: 'absolute',
                                    display: this.state?.currentPage
                                        ? ''
                                        : 'none',
                                }}
                                onClick={() => {
                                    this.setState({
                                        errMessage: '',
                                        currentPage: this.state.currentPage - 1,
                                        formList: this.state?.formList,
                                    })
                                    setTimeout(() => {
                                        setTimeout(() => {
                                            window.dispatchEvent(
                                                new CustomEvent('focusFrame', {
                                                    detail: {
                                                        frame: this.state
                                                            ?.title[
                                                            this.state
                                                                ?.currentPage
                                                        ].id,
                                                    },
                                                })
                                            )
                                        }, 300)
                                        this.setState({
                                            formList: this.state?.formList
                                                .reverse()
                                                .slice(1)
                                                .reverse(),
                                            title: this.state?.title
                                                .reverse()
                                                .slice(1)
                                                .reverse(),
                                        })
                                    }, 300)
                                }}
                            />
                        </div>
                        <br />
                        <div
                            style={{
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}>
                            <MenuSurfaceAnchor>
                                <Menu
                                    open={this.state?.showLangOp}
                                    onClose={() => {
                                        this.setState({ showLangOp: false })
                                    }}>
                                    <MenuItem>한국어</MenuItem>
                                </Menu>
                                <Button
                                    trailingIcon='keyboard_arrow_down'
                                    onClick={() => {
                                        this.setState({
                                            showLangOp: !this.state?.showLangOp,
                                        })
                                    }}>
                                    한국어
                                </Button>
                            </MenuSurfaceAnchor>
                            <MenuSurfaceAnchor>
                                <Menu
                                    open={this.state?.showTerm}
                                    onClose={() => {
                                        this.setState({ showTerm: false })
                                    }}>
                                    <MenuLink
                                        body='약관'
                                        to={createURL('', 'terms')}
                                        type={LinkType.a}
                                    />
                                    <MenuLink
                                        body='개인정보 처리방침'
                                        to={createURL('', 'userdata')}
                                        type={LinkType.a}
                                    />
                                    <MenuLink
                                        body='오픈소스'
                                        to={createURL('', 'opensource')}
                                        type={LinkType.a}
                                    />
                                </Menu>
                                <Button
                                    trailingIcon='keyboard_arrow_down'
                                    onClick={() => {
                                        this.setState({
                                            showTerm: !this.state?.showTerm,
                                        })
                                    }}>
                                    약관
                                </Button>
                            </MenuSurfaceAnchor>
                        </div>
                    </div>
                </div>
            </ThemeProvider>
        )
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    console.log(
        '%cIASA Portal\n%cCopyright 2019-2021 NULL®. All right reserved.\n%c경고!\n%c이곳에서 뭔가를 복사하거나 수정할 때는 꼭 무엇을 의미하는지 알아야 합니다. 신뢰할 수 없는 행위를 하는 경우 계정 해킹, 도용, 삭제 등의 심각한 상황이 일어날 수 있습니다. NULL은 이 문제에 관해 책임을 지지 않습니다.',
        'font-size:50px;',
        'font-size:20px;',
        'font-size:30px;color:red;',
        'font-size:15px;color:red;'
    )
    //@ts-ignore
    window.scrollObj = OverlayScrollbars(document.body, {
        callbacks: {
            onScroll: (e: any) => {
                if (!document.querySelector('header')) return
                if (e.target.scrollTop === 0)
                    document.querySelector('header').classList.remove('raised')
                else document.querySelector('header').classList.add('raised')
            },
        },
    })
    accountInfo = await fetchAPI('GET', {}, 'account', 'info')
    if (accountInfo.data.permission === Permission.none) {
        if (window.location.pathname.split('/').pop() === 'challenge')
            window.location.replace(createURL('account', 'signin'))
    }
    ReactDOM.render(<App />, document.getElementById('app') as HTMLElement)
})

export default App
