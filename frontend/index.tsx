import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'

import {ThemeProvider} from '@rmwc/Theme'

import {LoremIpsum} from "./util";

import {MainView, DefaultStudentNavList, TermsNavList, UserDataNavList, OpensourceNavList} from './mainview'
import Counter from './counter'
import Myeonbul from './myeonbul'
import Meal from "./meal";
import NotFound from './404'
import Terms from './terms'
import Userdata from './userdata'
import Opensource from "./opensource";

import "rmwc/dist/styles"
import {createSnackbarQueue} from "@rmwc/snackbar";


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


interface IState {
}


class App extends React.Component<any, IState> {
    public render() {
        const {messages, notify} = createSnackbarQueue()
        let theme = lightTheme
        //if (localStorage.theme === "1" || (localStorage.theme === "2" && window.matchMedia('(prefers-color-scheme: dark)').matches)) theme = darkTheme
        return <ThemeProvider options={theme}>
            <Router>
                <Switch>
                    <Route exact path="/">
                        <MainView messages={messages} navList={DefaultStudentNavList}
                                  appCont={<LoremIpsum count={50}/>}/>
                    </Route>
                    <Route path="/counter">
                        <MainView messages={messages} navList={DefaultStudentNavList}
                                  appCont={<Counter startNumber={0}/>}/>
                    </Route>
                    <Route path="/myeonbul">
                        <MainView messages={messages} navList={DefaultStudentNavList}
                                  appCont={<Myeonbul notify={notify}
                                                     data={{token: '', request: {type: '', uid: 1}}}/>}/>
                    </Route>
                    <Route path="/meal">
                        <MainView messages={messages} navList={DefaultStudentNavList}
                                  appCont={<Meal/>}/>
                    </Route>

                    <Route path="/terms">
                        <MainView messages={messages} navList={TermsNavList} appCont={<Terms/>}/>
                    </Route>
                    <Route path="/userdata">
                        <MainView messages={messages} navList={UserDataNavList} appCont={<Userdata/>}/>
                    </Route>
                    <Route path="/opensource">
                        <MainView messages={messages} navList={OpensourceNavList} appCont={<Opensource/>}/>
                    </Route>

                    <Route>
                        <MainView messages={messages} navList={DefaultStudentNavList} appCont={<NotFound/>}/>
                    </Route>
                </Switch>
            </Router>
        </ThemeProvider>
    }
}


document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(<App/>, document.getElementById('app') as HTMLElement)
})


export default App;
