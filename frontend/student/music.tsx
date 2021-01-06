import * as React from 'react'

import {Button} from '@rmwc/button'
import {Typography} from '@rmwc/typography'
import {
    DataTable,
    DataTableContent,
    DataTableHead,
    DataTableRow,
    DataTableHeadCell,
    DataTableBody,
    DataTableCell
} from '@rmwc/data-table'
import {Checkbox} from '@rmwc/checkbox'
import {TextField} from '@rmwc/textfield'
import {Grid, GridCell, GridRow} from '@rmwc/grid'
import {Menu, MenuSurfaceAnchor, MenuItem} from '@rmwc/menu'
import {ListDivider} from '@rmwc/list'
import {createSnackbarQueue, SnackbarQueue} from "@rmwc/snackbar"

import {MyeonbulResponse, MyeonbulResponseOne} from "../../scheme/api/myeonbul"
import {teacher, currentTeacherList} from '../../scheme/teacher/teacher'
import teacherList from "../../scheme/teacher/2021/list"
import {token} from "../../scheme/api/auth"
import Siema from "siema";
import createURL from "../../scheme/url";
import {LinearProgress} from "@rmwc/linear-progress";
import {
    Card,
    CardActionButton,
    CardActionButtons, CardActionIcon,
    CardActionIcons,
    CardActions,
    CardMedia,
    CardPrimaryAction
} from "@rmwc/card";

import {mealTime, mealTimeToString} from "../../scheme/api/meal"
import {CircularProgress} from "@rmwc/circular-progress"
import {MusicResponse, MusicResponseOne} from "../../scheme/api/music"
import * as ReactDOM from "react-dom";
import {BrIfMobile} from "../util";

interface MusicState {
    loaded: boolean,
}

interface MusicOneProps {
    data: MusicResponseOne,
}

interface MusicOneState {
    loaded: boolean,
    imageUrl: string,
}

class MusicOne extends React.Component<MusicOneProps, MusicOneState> {
    constructor(props: MusicOneProps) {
        super(props)
    }

    public render() {
        return <Card style={{margin: '20px'}}>
            <a href={this.props.data.yt} target="_blank">
                <CardPrimaryAction>
                    <CardMedia sixteenByNine style={{backgroundImage: `url(${this.props.data.thumbnail})`}}/>
                    <div style={{padding: '0 1rem 1rem 1rem'}}>
                        <Typography use="headline6" tag="h2" style={{color: 'black'}}>
                            {this.props.data.name}
                        </Typography>
                        <Typography use="body1" tag="div" theme="textSecondaryOnBackground">
                            {this.props.data.singer}
                        </Typography>
                    </div>
                </CardPrimaryAction>
            </a>
            <CardActions>
                <CardActionButtons>
                    <a href={this.props.data.yt} target="_blank"><CardActionButton>Youtube</CardActionButton></a>
                </CardActionButtons>
            </CardActions>
        </Card>
    }
}

class Music extends React.Component<{}, MusicState> {
    private today: Siema
    private tomorrow: Siema
    private todayList: JSX.Element[]
    private tomorrowList: JSX.Element[]
    private elementPerPage: number
    private animationDuration: number

    messages: any
    notify: any

    constructor(props: {}) {
        super(props)
        let qu = createSnackbarQueue()
        this.messages = qu.messages
        this.notify = qu.notify

        if (document.documentElement.offsetWidth < 700) this.elementPerPage = 1
        else if (document.documentElement.offsetWidth < 1020) this.elementPerPage = 2
        else if (document.documentElement.offsetWidth < 1440) this.elementPerPage = 3
        else this.elementPerPage = 4
        this.todayList = [] as JSX.Element[]
        this.tomorrowList = [] as JSX.Element[]
        this.animationDuration = 300
    }

    public componentDidMount() {
        this.today = new Siema({
            selector: '#music-today-container',
            duration: this.animationDuration,
            easing: 'ease-out',
            perPage: this.elementPerPage,
            startIndex: 0,
            draggable: true,
            multipleDrag: false,
            threshold: 50,
            loop: false,
        });
        this.tomorrow = new Siema({
            selector: '#music-tomorrow-container',
            duration: this.animationDuration,
            easing: 'ease-out',
            perPage: this.elementPerPage,
            startIndex: 0,
            draggable: true,
            multipleDrag: false,
            threshold: 50,
            loop: false,
        });
        this.refresh()
    }

    public refresh() {
        this.setState({loaded: false})

        setTimeout(() => {
            (() => {
                this.todayList.push(<MusicOne data={
                    {
                        name: "눈의 꽃",
                        singer: "박효신",
                        thumbnail: "https://i.ytimg.com/vi/sr3JaQ3h7YA/hqdefault.jpg",
                        yt: "https://www.youtube.com/watch?v=sr3JaQ3h7YA"
                    }
                }/>)
            })();
            setTimeout(() => {
                ((siema: Siema) => {
                    siema.append(Music.createCarouselItem(<MusicOne data={
                        {
                            name: "눈의 꽃",
                            singer: "박효신",
                            thumbnail: "https://i.ytimg.com/vi/sr3JaQ3h7YA/hqdefault.jpg",
                            yt: "https://www.youtube.com/watch?v=sr3JaQ3h7YA"
                        }
                    }/>))
                })(this.today)
            }, this.animationDuration);
            (() => {
                this.tomorrowList.push(<MusicOne data={
                    {
                        name: "눈의 꽃",
                        singer: "박효신",
                        thumbnail: "https://i.ytimg.com/vi/sr3JaQ3h7YA/hqdefault.jpg",
                        yt: "https://www.youtube.com/watch?v=sr3JaQ3h7YA"
                    }
                }/>)
            })();
            setTimeout(() => {
                ((siema: Siema) => {
                    siema.append(Music.createCarouselItem(<MusicOne data={
                        {
                            name: "눈의 꽃",
                            singer: "박효신",
                            thumbnail: "https://i.ytimg.com/vi/sr3JaQ3h7YA/hqdefault.jpg",
                            yt: "https://www.youtube.com/watch?v=sr3JaQ3h7YA"
                        }
                    }/>))
                })(this.tomorrow)
            }, this.animationDuration);
            this.setState({loaded: true})
        }, 500)

        /*
        fetch(CreateURL('api'))
            .then(response => response.json())
            .then(response => this.setState(response))
        */
    }

    private static createCarouselItem(el: JSX.Element) {
        const wrap = document.createElement('div')
        ReactDOM.render(el, wrap)
        return wrap
    }

    public componentWillUnmount() {
        this.today.destroy()
        this.tomorrow.destroy()
    }

    public register() {
        this.notify({
            title: <b>성공!</b>,
            body: '기상곡 신청에 성공했어요.',
            icon: 'check',
            dismissIcon: true
        })
    }

    public render() {
        return <div>
            <Typography use="headline3">기상곡</Typography>
            <BrIfMobile/>
            <Typography use="subtitle1" style={{marginLeft: '10px'}}>기상곡을 신청할 수 있어요.</Typography>
            <br/>
            <br/>
            <Typography use="headline5">기상곡 신청하기</Typography>
            <BrIfMobile/>
            <Typography use="subtitle2" style={{marginLeft: '10px'}}>매일 13시에 선착순으로 6곡을 신청받아요!</Typography>
            <br/>
            <Grid>
                <GridRow>
                    <GridCell desktop={4} tablet={4} phone={4}>
                        <TextField style={{width: '100%', height: '100%'}} outlined label="가수"/>
                    </GridCell>
                    <GridCell desktop={4} tablet={4} phone={4}>
                        <TextField style={{width: '100%', height: '100%'}} outlined label="노래 이름"/>
                    </GridCell>
                    <GridCell desktop={4} tablet={8} phone={4}>
                        <Button style={{width: '100%', height: '100%', minHeight: '45.2px'}} outlined label="신청"
                                trailingIcon="send" onClick={this.register.bind(this)}/>
                    </GridCell>
                </GridRow>
            </Grid>
            <br/>
            <Typography use="headline5">오늘 나왔던 기상곡</Typography>
            <br/>
            <br/>
            <div id="music-today-container" style={{padding: '1px', margin: '10px'}}>
                {this.todayList}
            </div>
            <Button outlined label="이전" icon="keyboard_arrow_left" style={{float: 'left'}} onClick={() => {
                this.today.prev()
            }}/>
            <Button outlined label="이후" trailingIcon="keyboard_arrow_right" style={{float: 'right'}} onClick={() => {
                this.today.next()
            }}/>
            <br/>
            <br/>
            <br/>
            <br/>
            <Typography use="headline5">내일 나올 기상곡</Typography>
            <br/>
            <br/>
            <div id="music-tomorrow-container" style={{padding: '1px', margin: '10px'}}>
                {this.tomorrowList}
            </div>
            <Button outlined label="이전" icon="keyboard_arrow_left" style={{float: 'left'}} onClick={() => {
                this.tomorrow.prev()
            }}/>
            <Button outlined label="이후" trailingIcon="keyboard_arrow_right" style={{float: 'right'}} onClick={() => {
                this.tomorrow.next()
            }}/>
            <br/>
            <br/>
            <SnackbarQueue messages={this.messages}/>
        </div>
    }
}

export default Music
