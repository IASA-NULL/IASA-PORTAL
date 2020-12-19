import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {BrowserRouter as Router, Switch, Route, Link, RouteComponentProps} from 'react-router-dom'

import Counter from './counter'
import MainView from './mainview'
import NotFound from './404'


interface IState {
}


class App extends React.Component<any, IState> {
    public render() {
        return <Router>
            <Switch>
                <Route path="/counter">
                    <MainView appCont={<Counter startNumber={0}/>}/>
                </Route>
                <Route>
                    <MainView appCont={<NotFound/>}/>
                </Route>
            </Switch>
        </Router>
    }
}


document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(<App/>, document.getElementById('app') as HTMLElement)
})


export default App;
