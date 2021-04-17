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
    MainView,
    DefaultStudentNavList,
    DefaultTeacherNavList,
    DefaultAdminNavList,
    OpensourceNavList,
    TermsNavList,
    UserDataNavList,
    OpenAPINavList,
} from './mainview'
import { fetchAPI, isDarkTheme } from './util'

import NotFound from './common/404'
import About from './noauth/about'
import { lightTheme, darkTheme } from './util'
import MailView from './common/mailview'
//RENDER_COMPONENT_IMPORTS//

interface IState {
    loaded: boolean
    data?: token
    theme: any
}

class App extends React.Component<any, IState> {
    public componentDidMount() {
        let theme
        if (isDarkTheme()) {
            theme = darkTheme
            document.getElementById('app').classList.add('dark')
        } else {
            theme = lightTheme
            document.getElementById('app').classList.remove('dark')
        }
        this.refresh()
        window.addEventListener('updateTheme', () => {
            if (isDarkTheme()) {
                this.setState({ theme: darkTheme })
                document.getElementById('app').classList.add('dark')
            } else {
                this.setState({ theme: lightTheme })
                document.getElementById('app').classList.remove('dark')
            }
        })
        this.state = { loaded: false, theme: theme }
    }

    public refresh() {
        this.setState({ loaded: false })
        fetchAPI('GET', {}, 'account', 'info').then((data) => {
            this.setState({ loaded: true, data: data.data })
        })
    }

    public render() {
        let mainView
        if (this.state?.data?.permission === Permission.student) {
            mainView = (
                <Switch>
                    //RENDER_ROUTER_STUDENT//
                    <Route path='/mail/:eid'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={DefaultStudentNavList}
                            appCont={<MailView data={this.state?.data} />}
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
                    //RENDER_ROUTER_TEACHER//
                    <Route path='/mail/:eid'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={DefaultTeacherNavList}
                            appCont={<MailView data={this.state?.data} />}
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
                    //RENDER_ROUTER_ADMIN//
                    <Route path='/mail/:eid'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={DefaultAdminNavList}
                            appCont={<MailView data={this.state?.data} />}
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
                    //RENDER_ROUTER_NONE//
                    <Route>
                        <Redirect to='/about' />
                    </Route>
                </Switch>
            )
        }
        return (
            <ThemeProvider options={this.state?.theme ?? lightTheme}>
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
    if (isDarkTheme()) {
        document.getElementById('preloader').style.background = '#000'
    }
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
