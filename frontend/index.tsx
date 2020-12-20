import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'

import {LoremIpsum} from "./util";
import {DrawerAppContent} from "@rmwc/drawer"

import {MainView, DefaultStudentNavList, TermsNavList} from './mainview'
import Counter from './counter'
import Myeonbul from './myeonbul'
import NotFound from './404'
import Terms from './terms'


interface IState {
}


class App extends React.Component<any, IState> {
    public render() {
        return <Router>
            <Switch>
                <Route exact path="/">
                    <MainView navList={DefaultStudentNavList} appCont={<LoremIpsum count={50}/>}/>
                </Route>
                <Route path="/counter">
                    <MainView navList={DefaultStudentNavList} appCont={<Counter startNumber={0}/>}/>
                </Route>
                <Route path="/myeonbul">
                    <MainView navList={DefaultStudentNavList} appCont={<Myeonbul token={''} request={{type: '', uid: 1}}/>}/>
                </Route>
                <Route path="/terms">
                    <MainView navList={TermsNavList} appCont={<Terms/>}/>
                </Route>
                <Route>
                    <MainView navList={DefaultStudentNavList} appCont={<NotFound/>}/>
                </Route>
            </Switch>
        </Router>
    }
}


document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(<App/>, document.getElementById('app') as HTMLElement)
})


export default App;
