import * as React from 'react'
import * as ReactDOM from 'react-dom'

import {ThemeProvider} from '@rmwc/Theme'
import {IconButton} from '@rmwc/icon-button'
import {LinearProgress} from '@rmwc/linear-progress'
import {Menu, MenuItem, MenuSurfaceAnchor} from '@rmwc/menu'
import {Icon} from '@rmwc/icon'
import {Typography} from "@rmwc/typography"
import {Button} from "@rmwc/button"

import "rmwc/dist/styles"
import '@rmwc/list/collapsible-list.css'
import '@material/list/dist/mdc.list.css'

import {LinkType, MenuLink} from "./util"

import {IdForm, PasswordForm} from "./account/signin"
import {FindID, FindPassword} from "./account/find"
import {Signup} from "./account/signup"
import {TextField} from "@rmwc/textfield";
import createURL from "../scheme/url";
import {main} from "ts-node/dist/bin";

const lightTheme = {
    primary: '#5351db',
    secondary: '#8cc4de',
    error: '#b00020',
    background: '#fff',
    surface: '#fff',
    onPrimary: 'rgba(255, 255, 255, 1)',
    onSecondary: 'rgba(255, 255, 255, 1)',
    onSurface: 'rgba(0, 0, 0, 0.87)',
    onError: '#fff',
    textPrimaryOnBackground: 'rgba(0, 0, 0, 0.87)',
    textSecondaryOnBackground: 'rgba(0, 0, 0, 0.54)',
    textHintOnBackground: 'rgba(0, 0, 0, 0.38)',
    textDisabledOnBackground: 'rgba(0, 0, 0, 0.38)',
    textIconOnBackground: 'rgba(0, 0, 0, 0.38)',
    textPrimaryOnLight: 'rgba(0, 0, 0, 0.87)',
    textSecondaryOnLight: 'rgba(0, 0, 0, 0.54)',
    textHintOnLight: 'rgba(0, 0, 0, 0.38)',
    textDisabledOnLight: 'rgba(0, 0, 0, 0.38)',
    textIconOnLight: 'rgba(0, 0, 0, 0.38)',
    textPrimaryOnDark: 'white',
    textSecondaryOnDark: 'rgba(255, 255, 255, 0.7)',
    textHintOnDark: 'rgba(255, 255, 255, 0.5)',
    textDisabledOnDark: 'rgba(255, 255, 255, 0.5)',
    textIconOnDark: 'rgba(255, 255, 255, 0.5)'
}

const darkTheme = {
    primary: '#24aee9',
    secondary: '#e539ff',
    error: '#b00020',
    background: '#212121',
    surface: '#37474F',
    onPrimary: 'rgba(255,255,255,.87)',
    onSecondary: 'rgba(0,0,0,0.87)',
    onSurface: 'rgba(255,255,255,.87)',
    onError: '#fff',
    textPrimaryOnBackground: 'rgba(255, 255, 255, 1)',
    textSecondaryOnBackground: 'rgba(255, 255, 255, 0.7)',
    textHintOnBackground: 'rgba(255, 255, 255, 0.5)',
    textDisabledOnBackground: 'rgba(255, 255, 255, 0.5)',
    textIconOnBackground: 'rgba(255, 255, 255, 0.5)',
    textPrimaryOnLight: 'rgba(0, 0, 0, 0.87)',
    textSecondaryOnLight: 'rgba(0, 0, 0, 0.54)',
    textHintOnLight: 'rgba(0, 0, 0, 0.38)',
    textDisabledOnLight: 'rgba(0, 0, 0, 0.38)',
    textIconOnLight: 'rgba(0, 0, 0, 0.38)',
    textPrimaryOnDark: 'white',
    textSecondaryOnDark: 'rgba(255, 255, 255, 0.7)',
    textHintOnDark: 'rgba(255, 255, 255, 0.5)',
    textDisabledOnDark: 'rgba(255, 255, 255, 0.5)',
    textIconOnDark: 'rgba(255, 255, 255, 0.5)'
}


const loginStateUpdate = new Event('loginStateUpdate')


interface IState {
    loaded: boolean,
    showLangOp: boolean,
    showTerm: boolean,
    formList: JSX.Element[],
    currentPage: number,
    errMessage: string,
    title: {
        main: string,
        sub: string
    }[],

    id: string,
    password: string
}


class App extends React.Component<any, IState> {
    constructor(props: IState) {
        super(props)
    }


    public componentDidMount() {
        let isMobile = (window.matchMedia("(max-width: 550px)").matches || window.matchMedia("(max-height: 650px)").matches)
        let context = {
            get: this.getSt.bind(this),
            set: this.setSt.bind(this)
        }
        this.setState({
            formList: [<IdForm setState={this.setState} isMobile={isMobile} next={
                this.getIdInfo(<PasswordForm setState={this.setState} isMobile={isMobile} find={
                    this.next(<FindPassword setState={this.setState} isMobile={isMobile}
                                            context={context}/>, "비밀번호 찾기", "이메일을 입력하세요.")
                } context={context} next={this.signin()}/>)
            } find={
                this.next(<FindID setState={this.setState} isMobile={isMobile}
                                  context={context}/>, "아이디 찾기", "이메일을 입력하세요.")
            } create={
                this.next(<Signup setState={this.setState} isMobile={isMobile}
                                  context={context}/>, "가입하기", "계속하려면 NULL에 개인별로 부여되는 코드를 요청하세요.")
            } context={context}/>]
        })
        this.setState({currentPage: 0, title: [{main: '로그인', sub: 'IASA PORTAL로 계속'}]})
        setTimeout(() => {
            this.setState({loaded: true})
        }, 500)
    }

    public getSt(key: string) {
        if (!this.state) return undefined
        // @ts-ignore
        return this.state[key]
    }

    public setSt(key: string, value: any) {
        // @ts-ignore
        this.setState({[key]: value})
    }

    public next(form: JSX.Element, mainTitle: string, subTitle: string) {
        return () => {
            this.setState({loaded: true})
            if (this.state.formList.length > this.state.currentPage + 1) {
                this.setState({
                    formList: [...this.state.formList.slice(0, this.state.currentPage + 1), form],
                    title: [...this.state.title.slice(0, this.state.currentPage + 1), {
                        main: mainTitle,
                        sub: subTitle
                    }]
                })
            } else {
                this.setState({
                    formList: [...this.state.formList, form], title: [...this.state.title, {
                        main: mainTitle,
                        sub: subTitle
                    }]
                })
            }
            this.setState({currentPage: this.state.currentPage + 1})
        }
    }

    public getIdInfo(form: JSX.Element) {
        return () => {
            this.setState({errMessage: ''})
            if (this.state?.id) {
                this.setState({loaded: false})
                fetch(createURL('api', 'account', 'username'), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: this.state?.id
                    })
                }).then(res => res.json()).then(res => {
                    if (res.success) {
                        this.next(form, `${res.data}님, 안녕하세요.`, '비밀번호를 입력해서 로그인')()
                    } else {
                        this.setState({errMessage: res.message, loaded: true})
                    }
                }).catch(e => {
                    this.setState({errMessage: '서버와 통신 중 오류가 발생했어요.'})
                })
            } else {
                this.setState({errMessage: '아이디를 입력하세요.'})
            }
        }
    }

    public signin() {
        return () => {
            this.setState({errMessage: ''})
            if (this.state?.password) {
                this.setState({loaded: false})
                fetch(createURL('api', 'account', 'signin'), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: this.state?.id,
                        password: this.state?.password,
                    })
                }).then(res => res.json()).then(res => {
                    if (res.success) {
                        location.replace('/')
                    } else {
                        this.setState({errMessage: res.message, loaded: true})
                    }
                }).catch(e => {
                    this.setState({errMessage: '서버와 통신 중 오류가 발생했어요.'})
                })
            } else {
                this.setState({errMessage: '비밀번호를 입력하세요.'})
            }
        }
    }


    public render() {
        let theme = lightTheme
        //if (localStorage.theme === "1" || (localStorage.theme === "2" && window.matchMedia('(prefers-color-scheme: dark)').matches)) theme = darkTheme

        let commonStyle = {
            overflowX: 'hidden',
            margin: '0',
            padding: '0',
            position: 'relative'
        }
        let mobileCont = {
            ...commonStyle, ...{
                width: '100%',
                height: 'calc(100% - 84px)'
            }
        }, desktopCont = {
            ...commonStyle, ...{
                width: '500px',
                height: '600px',
                border: '1px solid #bbbbbb',
                borderRadius: '5px'
            }
        }

        let isMobile = (window.matchMedia("(max-width: 550px)").matches || window.matchMedia("(max-height: 650px)").matches)

        window.dispatchEvent(loginStateUpdate)

        return <ThemeProvider options={theme}>
            <div style={{
                display: 'flex',
                width: '100vw',
                height: '100vh',
                padding: '0',
                margin: '0',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <div style={isMobile ? {
                    width: '100%',
                    height: '100%'
                } : {
                    width: '500px',
                    height: '600px',
                }}>
                    <div
                        style={isMobile ? mobileCont as React.CSSProperties : desktopCont as React.CSSProperties}>
                        <LinearProgress style={{opacity: this.state?.loaded ? '0' : '1', transition: 'opacity 0.5s'}}/>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            top: '0'
                        }}>
                            <div style={{textAlign: 'center', width: '100%'}}>
                                <img src="/static/img/logo.jpg" style={{width: '80px'}}/>
                                <br/>
                                <br/>
                                <Typography
                                    use="headline4">{(this.state?.title ?? [])[this.state?.currentPage ?? 0]?.main}</Typography>
                                <br/>
                                <br/>
                                <Typography
                                    use="subtitle1">{(this.state?.title ?? [])[this.state?.currentPage ?? 0]?.sub}</Typography>
                                <br/>
                                <br/>
                                <br/>
                                <div style={{
                                    position: 'relative',
                                    transition: 'left .3s ease',
                                    width: `${this.state?.formList?.length * 100}%`,
                                    left: `-${(this.state?.currentPage) * 100}%`,
                                }}>
                                    {this.state?.formList}
                                </div>
                            </div>
                        </div>
                        <IconButton icon="arrow_back" style={{
                            margin: '10px',
                            top: '0',
                            position: 'absolute',
                            display: this.state?.currentPage ? '' : 'none'
                        }} onClick={() => {
                            this.setState({currentPage: this.state.currentPage - 1})
                        }}/>
                    </div>
                    <br/>
                    <div
                        style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                        <MenuSurfaceAnchor>
                            <Menu open={this.state?.showLangOp}
                                  onClose={() => {
                                      this.setState({showLangOp: false})
                                  }}>
                                <MenuItem>한국어</MenuItem>
                            </Menu>
                            <Button trailingIcon="keyboard_arrow_down" onClick={() => {
                                this.setState({showLangOp: !this.state?.showLangOp})
                            }}>한국어</Button>
                        </MenuSurfaceAnchor>
                        <MenuSurfaceAnchor>
                            <Menu open={this.state?.showTerm}
                                  onClose={() => {
                                      this.setState({showTerm: false})
                                  }}>
                                <MenuLink body="약관" to="/terms" type={LinkType.a}/>
                                <MenuLink body="개인정보 처리방침" to="/userdata" type={LinkType.a}/>
                                <MenuLink body="오픈소스" to="/opensource" type={LinkType.a}/>
                            </Menu>
                            <Button trailingIcon="keyboard_arrow_down" onClick={() => {
                                this.setState({showTerm: !this.state?.showTerm})
                            }}>약관</Button>
                        </MenuSurfaceAnchor>
                    </div>
                </div>
            </div>
        </ThemeProvider>
    }
}


document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(<App/>, document.getElementById('app') as HTMLElement)
})


export default App;
