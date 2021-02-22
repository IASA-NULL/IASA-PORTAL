import * as ReactDOM from 'react-dom'
import * as React from 'react'
import { token } from '../../scheme/api/auth'
import { fetchAPI, lightTheme, RequireSudo } from '../util'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { ThemeProvider } from '@rmwc/theme'

import 'rmwc/dist/styles'
import '@rmwc/list/collapsible-list.css'
import '@material/list/dist/mdc.list.css'
import { Typography } from '@rmwc/typography'
import { Button } from '@rmwc/button'

import MyeonbulBoss from './myeonbul_boss'

declare const DEV_MODE: boolean

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
        if (!this.state?.data) return <></>
        return (
            <ThemeProvider options={lightTheme}>
                <Router>
                    <Switch>
                        <Route
                            exact
                            path={
                                DEV_MODE
                                    ? '/application/myeonbul_boss'
                                    : '/myeonbul_boss'
                            }>
                            <RequireSudo />
                            <MyeonbulBoss data={this.state.data} />
                        </Route>
                        <Route>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '100vh',
                                }}>
                                <Typography use='headline3'>404</Typography>
                                <br />
                                <Typography
                                    use='subtitle1'
                                    style={{ marginLeft: '10px' }}>
                                    페이지를 찾을 수 없어요 :(
                                </Typography>
                                <br />
                                <br />
                                <Button
                                    onClick={() => {
                                        window.close()
                                    }}
                                    outlined>
                                    닫기
                                </Button>
                            </div>
                        </Route>
                    </Switch>
                </Router>
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
