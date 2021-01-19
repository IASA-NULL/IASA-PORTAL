import * as React from "react";
import * as ReactDOM from "react-dom";
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect,
} from "react-router-dom";

import { ThemeProvider } from "@rmwc/Theme";

import "rmwc/dist/styles";
import { createSnackbarQueue } from "@rmwc/snackbar";
import "@rmwc/list/collapsible-list.css";
import "@material/list/dist/mdc.list.css";
import createURL from "../scheme/url";
import { Permission, token } from "../scheme/api/auth";
import {
    DefaultStudentNavList,
    DefaultTeacherNavList,
    DefaultAdminNavList,
    MainView,
    OpensourceNavList,
    TermsNavList,
    UserDataNavList,
} from "./mainview";
import { LoremIpsum } from "./util";
import MyeonbulStudent from "./student/myeonbul";
import PenaltyStudent from "./student/penalty";
import Meal from "./common/meal";
import Terms from "./common/terms";
import Userdata from "./common/userdata";
import Opensource from "./common/opensource";
import NotFound from "./common/404";
import About from "./noauth/about";
import Music from "./student/music";
import Update from "./admin/update";
import { Program_Ip } from "./student/program/ip";

const lightTheme = {
    primary: "#5351db",
    secondary: "#8cc4de",
    error: "#b00020",
    background: "#fff",
    surface: "#fff",
    onPrimary: "rgba(255, 255, 255, 1)",
    onSecondary: "rgba(255, 255, 255, 1)",
    onSurface: "rgba(0, 0, 0, 0.87)",
    onError: "#fff",
    textPrimaryOnBackground: "rgba(0, 0, 0, 0.87)",
    textSecondaryOnBackground: "rgba(0, 0, 0, 0.54)",
    textHintOnBackground: "rgba(0, 0, 0, 0.38)",
    textDisabledOnBackground: "rgba(0, 0, 0, 0.38)",
    textIconOnBackground: "rgba(0, 0, 0, 0.38)",
    textPrimaryOnLight: "rgba(0, 0, 0, 0.87)",
    textSecondaryOnLight: "rgba(0, 0, 0, 0.54)",
    textHintOnLight: "rgba(0, 0, 0, 0.38)",
    textDisabledOnLight: "rgba(0, 0, 0, 0.38)",
    textIconOnLight: "rgba(0, 0, 0, 0.38)",
    textPrimaryOnDark: "white",
    textSecondaryOnDark: "rgba(255, 255, 255, 0.7)",
    textHintOnDark: "rgba(255, 255, 255, 0.5)",
    textDisabledOnDark: "rgba(255, 255, 255, 0.5)",
    textIconOnDark: "rgba(255, 255, 255, 0.5)",
};

const darkTheme = {
    primary: "#24aee9",
    secondary: "#e539ff",
    error: "#b00020",
    background: "#212121",
    surface: "#37474F",
    onPrimary: "rgba(255,255,255,.87)",
    onSecondary: "rgba(0,0,0,0.87)",
    onSurface: "rgba(255,255,255,.87)",
    onError: "#fff",
    textPrimaryOnBackground: "rgba(255, 255, 255, 1)",
    textSecondaryOnBackground: "rgba(255, 255, 255, 0.7)",
    textHintOnBackground: "rgba(255, 255, 255, 0.5)",
    textDisabledOnBackground: "rgba(255, 255, 255, 0.5)",
    textIconOnBackground: "rgba(255, 255, 255, 0.5)",
    textPrimaryOnLight: "rgba(0, 0, 0, 0.87)",
    textSecondaryOnLight: "rgba(0, 0, 0, 0.54)",
    textHintOnLight: "rgba(0, 0, 0, 0.38)",
    textDisabledOnLight: "rgba(0, 0, 0, 0.38)",
    textIconOnLight: "rgba(0, 0, 0, 0.38)",
    textPrimaryOnDark: "white",
    textSecondaryOnDark: "rgba(255, 255, 255, 0.7)",
    textHintOnDark: "rgba(255, 255, 255, 0.5)",
    textDisabledOnDark: "rgba(255, 255, 255, 0.5)",
    textIconOnDark: "rgba(255, 255, 255, 0.5)",
};

interface IState {
    loaded: boolean;
    data: token;
}

class App extends React.Component<any, IState> {
    public componentDidMount() {
        this.refresh();
    }

    public refresh() {
        this.setState({ loaded: false });
        fetch(createURL("api", "account", "info"))
            .then((res) => res.json())
            .then((data) => {
                this.setState({ loaded: true, data: data.data });
            });
    }

    public render() {
        let theme = lightTheme,
            mainView;
        //if (localStorage.theme === "1" || (localStorage.theme === "2" && window.matchMedia('(prefers-color-scheme: dark)').matches)) theme = darkTheme
        if (this.state?.data?.permission === Permission.student) {
            mainView = (
                <Switch>
                    <Route exact path="/">
                        <MainView
                            accountInfo={this.state.data}
                            navList={DefaultStudentNavList}
                            appCont={<LoremIpsum count={50} />}
                        />
                    </Route>

                    <Route path="/myeonbul">
                        <MainView
                            accountInfo={this.state.data}
                            navList={DefaultStudentNavList}
                            appCont={
                                <MyeonbulStudent data={this.state?.data} />
                            }
                        />
                    </Route>
                    <Route path="/music">
                        <MainView
                            accountInfo={this.state.data}
                            navList={DefaultStudentNavList}
                            appCont={<Music />}
                        />
                    </Route>

                    <Route path="/meal">
                        <MainView
                            accountInfo={this.state.data}
                            navList={DefaultStudentNavList}
                            appCont={<Meal />}
                        />
                    </Route>
                    <Route path="/penalty">
                        <MainView
                            accountInfo={this.state.data}
                            navList={DefaultStudentNavList}
                            appCont={<PenaltyStudent data={this.state?.data} />}
                        />
                    </Route>

                    <Route path="/terms">
                        <MainView
                            accountInfo={this.state.data}
                            navList={TermsNavList}
                            appCont={<Terms />}
                        />
                    </Route>
                    <Route path="/userdata">
                        <MainView
                            accountInfo={this.state.data}
                            navList={UserDataNavList}
                            appCont={<Userdata />}
                        />
                    </Route>
                    <Route path="/opensource">
                        <MainView
                            accountInfo={this.state.data}
                            navList={OpensourceNavList}
                            appCont={<Opensource />}
                        />
                    </Route>

                    <Route path="/program/ip">
                        <MainView
                            accountInfo={this.state.data}
                            navList={DefaultStudentNavList}
                            appCont={<Program_Ip />}
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
            );
        } else if (this.state?.data?.permission === Permission.teacher) {
            mainView = (
                <Switch>
                    <Route path="/meal">
                        <MainView
                            accountInfo={this.state.data}
                            navList={DefaultTeacherNavList}
                            appCont={<Meal />}
                        />
                    </Route>

                    <Route path="/terms">
                        <MainView
                            accountInfo={this.state.data}
                            navList={TermsNavList}
                            appCont={<Terms />}
                        />
                    </Route>
                    <Route path="/userdata">
                        <MainView
                            accountInfo={this.state.data}
                            navList={UserDataNavList}
                            appCont={<Userdata />}
                        />
                    </Route>
                    <Route path="/opensource">
                        <MainView
                            accountInfo={this.state.data}
                            navList={OpensourceNavList}
                            appCont={<Opensource />}
                        />
                    </Route>

                    <Route path="/program/ip">
                        <MainView
                            accountInfo={this.state.data}
                            navList={DefaultTeacherNavList}
                            appCont={<Program_Ip />}
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
            );
        } else if (this.state?.data?.permission === Permission.admin) {
            mainView = (
                <Switch>
                    <Route path="/terms">
                        <MainView
                            accountInfo={this.state.data}
                            navList={TermsNavList}
                            appCont={<Terms />}
                        />
                    </Route>
                    <Route path="/userdata">
                        <MainView
                            accountInfo={this.state.data}
                            navList={UserDataNavList}
                            appCont={<Userdata />}
                        />
                    </Route>
                    <Route path="/opensource">
                        <MainView
                            accountInfo={this.state.data}
                            navList={OpensourceNavList}
                            appCont={<Opensource />}
                        />
                    </Route>

                    <Route path="/update">
                        <MainView
                            accountInfo={this.state.data}
                            navList={DefaultAdminNavList}
                            appCont={<Update />}
                        />
                    </Route>

                    <Route path="/program/ip">
                        <MainView
                            accountInfo={this.state.data}
                            navList={DefaultAdminNavList}
                            appCont={<Program_Ip />}
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
            );
        } else if (this.state?.data?.permission === Permission.none) {
            mainView = (
                <Switch>
                    <Route exact path="/about">
                        <About />
                    </Route>

                    <Route path="/terms">
                        <MainView
                            accountInfo={this.state.data}
                            navList={TermsNavList}
                            appCont={<Terms />}
                        />
                    </Route>
                    <Route path="/userdata">
                        <MainView
                            accountInfo={this.state.data}
                            navList={UserDataNavList}
                            appCont={<Userdata />}
                        />
                    </Route>
                    <Route path="/opensource">
                        <MainView
                            accountInfo={this.state.data}
                            navList={OpensourceNavList}
                            appCont={<Opensource />}
                        />
                    </Route>

                    <Route path="/program/ip">
                        <MainView
                            accountInfo={this.state.data}
                            appCont={<Program_Ip />}
                        />
                    </Route>

                    <Route>
                        <Redirect to="/about" />
                    </Route>
                </Switch>
            );
        }
        return (
            <ThemeProvider options={theme}>
                <Router>{mainView}</Router>
            </ThemeProvider>
        );
    }
}

document.addEventListener("DOMContentLoaded", () => {
    console.log(
        "%cIASA Portal\n%cCopyright 2019-2021 NULL®. All right reserved.\n%c경고!\n%c이곳에서 뭔가를 복사하거나 수정할 때는 꼭 무엇을 의미하는지 알아야 합니다. 신뢰할 수 없는 행위를 하는 경우 계정 해킹, 도용, 삭제 등의 심각한 상황이 일어날 수 있습니다. NULL은 이 문제에 관해 책임을 지지 않습니다.",
        "font-size:50px;",
        "font-size:20px;",
        "font-size:30px;color:red;",
        "font-size:15px;color:red;"
    );
    ReactDOM.render(<App />, document.getElementById("app") as HTMLElement);
});

export default App;
