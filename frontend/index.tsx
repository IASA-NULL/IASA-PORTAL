import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect,
} from 'react-router-dom'

import { ThemeProvider } from '@rmwc/theme'

import 'rmwc/dist/styles'
import '@rmwc/list/collapsible-list.css'
import '@material/list/dist/mdc.list.css'
import { Permission, token } from '../scheme/api/auth'
import {
    DefaultStudentNavList,
    DefaultTeacherNavList,
    DefaultAdminNavList,
    MainView,
    OpensourceNavList,
    TermsNavList,
    UserDataNavList,
    OpenAPINavList,
} from './mainview'
import { fetchAPI } from './util'

import MyeonbulStudent from './student/myeonbul'
import PenaltyStudent from './student/penalty'
import MainStudent from './student/main'
import MusicStudent from './student/music'

import MyeonbulTeacher from './teacher/myeonbul'
import PenaltyTeacher from './teacher/penalty'
import MainTeacher from './teacher/main'
import MusicTeacher from './teacher/music'
import Print from './teacher/print'

import MainAdmin from './admin/main'
import Update from './admin/update'
import CreateCode from './admin/createcode'
import CreateAPI from './admin/api'
import Assign from './admin/assign'

import Mail from './common/mail'
import Meal from './common/meal'
import Share from './common/share'
import Terms from './common/terms'
import Userdata from './common/userdata'
import Opensource from './common/opensource'
import NotFound from './common/404'
import About from './noauth/about'
import PROGRAM_IP from './student/program/ip'
import MyPage from './common/mypage'
import { lightTheme } from './util'
import MailView from './common/mailview'

import OpenAPIIndex from './openapi'
import OpenAPIAccount from './openapi/account'
import OpenAPIMeal from './openapi/meal'
import OpenAPIDesc from './openapi/desc'
import PROGRAM_NETWORK from './common/network'
import Notifications from './common/notifications'

interface IState {
    loaded: boolean
    data: token
}

class App extends React.Component<any, IState> {
    public componentDidMount() {
        this.refresh()
    }

    public refresh() {
        this.setState({ loaded: false })
        fetchAPI('GET', {}, 'account', 'info').then((data) => {
            this.setState({ loaded: true, data: data.data })
        })
    }

    public render() {
        let theme = lightTheme,
            mainView
        //if (localStorage.theme === "1" || (localStorage.theme === "2" && window.matchMedia('(prefers-color-scheme: dark)').matches)) theme = darkTheme
        if (this.state?.data?.permission === Permission.student) {
            mainView = (
                <Switch>
                    <Route exact path='/'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={DefaultStudentNavList}
                            appCont={<MainStudent />}
                        />
                    </Route>

                    <Route path='/mail/:eid'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={DefaultStudentNavList}
                            appCont={<MailView data={this.state?.data} />}
                        />
                    </Route>

                    <Route path='/mail'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={DefaultStudentNavList}
                            appCont={<Mail data={this.state?.data} />}
                        />
                    </Route>

                    <Route path='/myeonbul'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={DefaultStudentNavList}
                            appCont={
                                <MyeonbulStudent data={this.state?.data} />
                            }
                        />
                    </Route>
                    <Route path='/music'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={DefaultStudentNavList}
                            appCont={<MusicStudent />}
                        />
                    </Route>

                    <Route path='/meal'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={DefaultStudentNavList}
                            appCont={<Meal />}
                        />
                    </Route>
                    <Route path='/penalty'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={DefaultStudentNavList}
                            appCont={<PenaltyStudent data={this.state?.data} />}
                        />
                    </Route>

                    <Route path='/share'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={DefaultStudentNavList}
                            appCont={<Share />}
                        />
                    </Route>

                    <Route path='/mypage'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={DefaultStudentNavList}
                            appCont={<MyPage />}
                        />
                    </Route>

                    <Route path='/notifications'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={DefaultStudentNavList}
                            appCont={<Notifications data={this.state.data} />}
                        />
                    </Route>

                    <Route path='/terms'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={TermsNavList}
                            appCont={<Terms />}
                        />
                    </Route>
                    <Route path='/userdata'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={UserDataNavList}
                            appCont={<Userdata />}
                        />
                    </Route>
                    <Route path='/opensource'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={OpensourceNavList}
                            appCont={<Opensource />}
                        />
                    </Route>

                    <Route path='/program/ip'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={DefaultStudentNavList}
                            appCont={<PROGRAM_IP />}
                        />
                    </Route>

                    <Route path='/program/network'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={DefaultStudentNavList}
                            appCont={<PROGRAM_NETWORK />}
                        />
                    </Route>

                    <Route path='/openapi/desc'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={OpenAPINavList}
                            appCont={<OpenAPIDesc />}
                        />
                    </Route>

                    <Route path='/openapi/account'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={OpenAPINavList}
                            appCont={<OpenAPIAccount />}
                        />
                    </Route>

                    <Route path='/openapi/meal'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={OpenAPINavList}
                            appCont={<OpenAPIMeal />}
                        />
                    </Route>

                    <Route path='/openapi'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={OpenAPINavList}
                            appCont={<OpenAPIIndex />}
                        />
                    </Route>

                    <Route>
                        <MainView
                            accountInfo={this.state.data}
                            navList={DefaultStudentNavList}
                            appCont={<NotFound />}
                        />
                    </Route>
                </Switch>
            )
        } else if (this.state?.data?.permission === Permission.teacher) {
            mainView = (
                <Switch>
                    <Route exact path='/'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={DefaultTeacherNavList}
                            appCont={<MainTeacher />}
                        />
                    </Route>

                    <Route path='/mail/:eid'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={DefaultTeacherNavList}
                            appCont={<MailView data={this.state?.data} />}
                        />
                    </Route>

                    <Route path='/mail'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={DefaultTeacherNavList}
                            appCont={<Mail data={this.state?.data} />}
                        />
                    </Route>

                    <Route path='/myeonbul'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={DefaultTeacherNavList}
                            appCont={
                                <MyeonbulTeacher data={this.state?.data} />
                            }
                        />
                    </Route>
                    <Route path='/penalty'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={DefaultTeacherNavList}
                            appCont={<PenaltyTeacher data={this.state?.data} />}
                        />
                    </Route>

                    <Route path='/music'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={DefaultTeacherNavList}
                            appCont={<MusicTeacher />}
                        />
                    </Route>

                    <Route path='/print'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={DefaultTeacherNavList}
                            appCont={<Print data={this.state?.data} />}
                        />
                    </Route>

                    <Route path='/meal'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={DefaultTeacherNavList}
                            appCont={<Meal />}
                        />
                    </Route>

                    <Route path='/mypage'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={DefaultTeacherNavList}
                            appCont={<MyPage />}
                        />
                    </Route>

                    <Route path='/notifications'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={DefaultTeacherNavList}
                            appCont={<Notifications data={this.state.data} />}
                        />
                    </Route>

                    <Route path='/terms'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={TermsNavList}
                            appCont={<Terms />}
                        />
                    </Route>
                    <Route path='/userdata'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={UserDataNavList}
                            appCont={<Userdata />}
                        />
                    </Route>
                    <Route path='/opensource'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={OpensourceNavList}
                            appCont={<Opensource />}
                        />
                    </Route>

                    <Route path='/program/ip'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={DefaultTeacherNavList}
                            appCont={<PROGRAM_IP />}
                        />
                    </Route>

                    <Route path='/program/network'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={DefaultTeacherNavList}
                            appCont={<PROGRAM_NETWORK />}
                        />
                    </Route>

                    <Route path='/share'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={DefaultTeacherNavList}
                            appCont={<Share />}
                        />
                    </Route>

                    <Route path='/openapi/desc'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={OpenAPINavList}
                            appCont={<OpenAPIDesc />}
                        />
                    </Route>

                    <Route path='/openapi/account'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={OpenAPINavList}
                            appCont={<OpenAPIAccount />}
                        />
                    </Route>

                    <Route path='/openapi/meal'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={OpenAPINavList}
                            appCont={<OpenAPIMeal />}
                        />
                    </Route>

                    <Route path='/openapi'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={OpenAPINavList}
                            appCont={<OpenAPIIndex />}
                        />
                    </Route>

                    <Route>
                        <MainView
                            accountInfo={this.state.data}
                            navList={DefaultTeacherNavList}
                            appCont={<NotFound />}
                        />
                    </Route>
                </Switch>
            )
        } else if (this.state?.data?.permission === Permission.admin) {
            mainView = (
                <Switch>
                    <Route exact path='/'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={DefaultAdminNavList}
                            appCont={<MainAdmin />}
                        />
                    </Route>

                    <Route path='/mail/:eid'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={DefaultAdminNavList}
                            appCont={<MailView data={this.state?.data} />}
                        />
                    </Route>

                    <Route path='/mail'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={DefaultAdminNavList}
                            appCont={<Mail data={this.state?.data} />}
                        />
                    </Route>

                    <Route path='/update'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={DefaultAdminNavList}
                            appCont={<Update />}
                        />
                    </Route>

                    <Route path='/user/code'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={DefaultAdminNavList}
                            appCont={<CreateCode />}
                        />
                    </Route>

                    <Route path='/createapi'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={DefaultAdminNavList}
                            appCont={<CreateAPI />}
                        />
                    </Route>

                    <Route path='/assign'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={DefaultAdminNavList}
                            appCont={<Assign />}
                        />
                    </Route>

                    <Route path='/mypage'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={DefaultAdminNavList}
                            appCont={<MyPage />}
                        />
                    </Route>

                    <Route path='/share'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={DefaultAdminNavList}
                            appCont={<Share />}
                        />
                    </Route>

                    <Route path='/notifications'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={DefaultAdminNavList}
                            appCont={<Notifications data={this.state.data} />}
                        />
                    </Route>

                    <Route path='/program/ip'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={DefaultAdminNavList}
                            appCont={<PROGRAM_IP />}
                        />
                    </Route>

                    <Route path='/program/network'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={DefaultAdminNavList}
                            appCont={<PROGRAM_NETWORK />}
                        />
                    </Route>

                    <Route path='/terms'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={TermsNavList}
                            appCont={<Terms />}
                        />
                    </Route>

                    <Route path='/userdata'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={UserDataNavList}
                            appCont={<Userdata />}
                        />
                    </Route>

                    <Route path='/opensource'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={OpensourceNavList}
                            appCont={<Opensource />}
                        />
                    </Route>

                    <Route path='/openapi/desc'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={OpenAPINavList}
                            appCont={<OpenAPIDesc />}
                        />
                    </Route>

                    <Route path='/openapi/account'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={OpenAPINavList}
                            appCont={<OpenAPIAccount />}
                        />
                    </Route>

                    <Route path='/openapi/meal'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={OpenAPINavList}
                            appCont={<OpenAPIMeal />}
                        />
                    </Route>

                    <Route path='/openapi'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={OpenAPINavList}
                            appCont={<OpenAPIIndex />}
                        />
                    </Route>

                    <Route>
                        <MainView
                            accountInfo={this.state.data}
                            navList={DefaultAdminNavList}
                            appCont={<NotFound />}
                        />
                    </Route>
                </Switch>
            )
        } else if (this.state?.data?.permission === Permission.none) {
            mainView = (
                <Switch>
                    <Route exact path='/about'>
                        <About />
                    </Route>

                    <Route path='/terms'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={TermsNavList}
                            appCont={<Terms />}
                        />
                    </Route>
                    <Route path='/userdata'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={UserDataNavList}
                            appCont={<Userdata />}
                        />
                    </Route>
                    <Route path='/opensource'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={OpensourceNavList}
                            appCont={<Opensource />}
                        />
                    </Route>

                    <Route path='/program/ip'>
                        <MainView
                            accountInfo={this.state.data}
                            appCont={<PROGRAM_IP />}
                        />
                    </Route>

                    <Route path='/program/network'>
                        <MainView
                            accountInfo={this.state.data}
                            appCont={<PROGRAM_NETWORK />}
                        />
                    </Route>

                    <Route path='/share'>
                        <MainView
                            accountInfo={this.state.data}
                            appCont={<Share hideDownload={true} />}
                        />
                    </Route>

                    <Route path='/openapi/desc'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={OpenAPINavList}
                            appCont={<OpenAPIDesc />}
                        />
                    </Route>

                    <Route path='/openapi/account'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={OpenAPINavList}
                            appCont={<OpenAPIAccount />}
                        />
                    </Route>

                    <Route path='/openapi/meal'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={OpenAPINavList}
                            appCont={<OpenAPIMeal />}
                        />
                    </Route>

                    <Route path='/openapi'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={OpenAPINavList}
                            appCont={<OpenAPIIndex />}
                        />
                    </Route>

                    <Route>
                        <Redirect to='/about' />
                    </Route>
                </Switch>
            )
        }
        return (
            <ThemeProvider options={theme}>
                <Router>{mainView}</Router>
            </ThemeProvider>
        )
    }
}

function init() {
    try {
        document.getElementById('preloader').classList.remove('anim')
    } catch (e) {}
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
    ReactDOM.render(<App />, document.getElementById('app') as HTMLElement)
    setTimeout(function () {
        document.getElementById('preloader').style.opacity = '0'
        setTimeout(function () {
            document.getElementById('preloader').remove()
        }, 500)
    }, 100)
}

declare const timerStart: number

document.addEventListener('DOMContentLoaded', () => {
    console.log(
        '%cIASA Portal\n%cCopyright 2019-2021 NULL®. All right reserved.\n%c경고!\n%c이곳에서 뭔가를 복사하거나 수정할 때는 꼭 무엇을 의미하는지 알아야 합니다. 신뢰할 수 없는 행위를 하는 경우 계정 해킹, 도용, 삭제 등의 심각한 상황이 일어날 수 있습니다. NULL은 이 문제에 관해 책임을 지지 않습니다.',
        'font-size:50px;',
        'font-size:20px;',
        'font-size:30px;color:red;',
        'font-size:15px;color:red;'
    )
    setTimeout(init, Math.max(2000 - Date.now() + timerStart, 0))
})

export default App
