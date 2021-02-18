import * as React from 'react'

import { Button } from '@rmwc/button'
import { Typography } from '@rmwc/typography'
import { TextField } from '@rmwc/textfield'
import { Grid, GridCell, GridRow } from '@rmwc/grid'
import { createSnackbarQueue, SnackbarQueue } from '@rmwc/snackbar'

import Siema from 'siema'
import {
    Card,
    CardActionButton,
    CardActionButtons,
    CardActions,
    CardMedia,
    CardPrimaryAction,
} from '@rmwc/card'

import { CircularProgress } from '@rmwc/circular-progress'
import { MusicResponse, MusicResponseOne } from '../../scheme/api/music'
import * as ReactDOM from 'react-dom'
import { BrIfMobile, fetchAPI, focusNextInput } from '../util'
import {
    Dialog,
    DialogActions,
    DialogButton,
    DialogContent,
    DialogTitle,
} from '@rmwc/dialog'

interface MusicState {
    loaded: boolean
    requestSinger: string
    requestName: string
    confirm: boolean
    find: MusicResponseOne
    findLoaded: boolean
}

interface MusicOneProps {
    data: MusicResponseOne
}

interface MusicOneState {
    loaded: boolean
    imageUrl: string
}

class MusicOne extends React.Component<MusicOneProps, MusicOneState> {
    public render() {
        return (
            <Card style={{ margin: '20px' }}>
                <a
                    rel='noreferrer'
                    href={`https://www.youtube.com/watch?v=${this.props.data.yt}`}
                    target='_blank'>
                    <CardPrimaryAction>
                        <CardMedia
                            sixteenByNine
                            style={{
                                backgroundImage: `url(${this.props.data.thumbnail})`,
                            }}
                        />
                        <div style={{ padding: '0 1rem 1rem 1rem' }}>
                            <Typography
                                use='headline6'
                                tag='h2'
                                style={{ color: 'black' }}>
                                {this.props.data.name}
                            </Typography>
                            <Typography
                                use='body1'
                                tag='div'
                                theme='textSecondaryOnBackground'>
                                {this.props.data.singer}
                            </Typography>
                        </div>
                    </CardPrimaryAction>
                </a>
                <CardActions>
                    <CardActionButtons>
                        <a
                            href={`https://www.youtube.com/watch?v=${this.props.data.yt}`}
                            target='_blank'
                            rel='noreferrer'>
                            <CardActionButton>Youtube</CardActionButton>
                        </a>
                    </CardActionButtons>
                </CardActions>
            </Card>
        )
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
        else if (document.documentElement.offsetWidth < 1090)
            this.elementPerPage = 2
        else if (document.documentElement.offsetWidth < 1440)
            this.elementPerPage = 3
        else this.elementPerPage = 4
        this.todayList = [] as JSX.Element[]
        this.tomorrowList = [] as JSX.Element[]
        this.animationDuration = 300

        this.handleChange = this.handleChange.bind(this)
    }

    public componentDidMount() {
        this.today = new Siema({
            selector: '#music-today-container',
            duration: this.animationDuration,
            easing: 'ease-out',
            perPage: this.elementPerPage,
            startIndex: 0,
            draggable: true,
            threshold: 50,
            loop: false,
        })
        this.tomorrow = new Siema({
            selector: '#music-tomorrow-container',
            duration: this.animationDuration,
            easing: 'ease-out',
            perPage: this.elementPerPage,
            startIndex: 0,
            draggable: true,
            threshold: 50,
            loop: false,
        })
        this.refresh()
    }

    public refresh() {
        this.setState({ loaded: false })
        fetchAPI('GET', {}, 'music', 'today').then((res: MusicResponse) => {
            for (let i = 0; i < this.todayList.length; i++) this.today.remove(0)
            for (let i = 0; i < this.tomorrowList.length; i++)
                this.tomorrow.remove(0)
            this.todayList = []
            this.tomorrowList = []
            if (res.success) {
                res.data.today.map((el: MusicResponseOne) => {
                    ;(() => {
                        this.todayList.push(<MusicOne data={el} />)
                    })()
                    setTimeout(() => {
                        ;((siema: Siema) => {
                            siema.append(
                                Music.createCarouselItem(<MusicOne data={el} />)
                            )
                        })(this.today)
                    }, this.animationDuration)
                    return true
                })
                res.data.tomorrow.map((el: MusicResponseOne) => {
                    ;(() => {
                        this.tomorrowList.push(<MusicOne data={el} />)
                    })()
                    setTimeout(() => {
                        ;((siema: Siema) => {
                            siema.append(
                                Music.createCarouselItem(<MusicOne data={el} />)
                            )
                        })(this.tomorrow)
                    }, this.animationDuration)
                    return true
                })
            }
            this.setState({ loaded: true })
        })
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

    public handleChange(e: React.FormEvent<HTMLInputElement>, target: string) {
        // @ts-ignore
        this.setState({ [target]: e.target.value })
    }

    public render() {
        return (
            <div>
                <Typography use='headline3'>기상곡</Typography>
                <BrIfMobile />
                <Typography use='subtitle1' style={{ marginLeft: '10px' }}>
                    기상곡을 확인할 수 있어요.
                </Typography>
                <br />
                <br />
                <Typography use='headline5'>오늘 나왔던 기상곡</Typography>
                <br />
                <br />
                <div
                    id='music-today-container'
                    style={{ padding: '1px', margin: '10px' }}>
                    {this.todayList}
                </div>
                {this.state?.loaded ? (
                    <>
                        {this.todayList.length > 0 ? (
                            <>
                                <Button
                                    outlined
                                    label='이전'
                                    icon='keyboard_arrow_left'
                                    style={{ float: 'left' }}
                                    onClick={() => {
                                        this.today.prev()
                                    }}
                                />
                                <Button
                                    outlined
                                    label='이후'
                                    trailingIcon='keyboard_arrow_right'
                                    style={{ float: 'right' }}
                                    onClick={() => {
                                        this.today.next()
                                    }}
                                />
                            </>
                        ) : (
                            <p style={{ marginTop: '-20px' }}>
                                신청된 기상곡이 없어요!
                            </p>
                        )}
                    </>
                ) : (
                    <CircularProgress size={96} />
                )}
                <br />
                <br />
                <br />
                <br />
                <Typography use='headline5'>내일 나올 기상곡</Typography>
                <br />
                <br />
                <div
                    id='music-tomorrow-container'
                    style={{ padding: '1px', margin: '10px' }}>
                    {this.tomorrowList}
                </div>
                {this.state?.loaded ? (
                    <>
                        {this.tomorrowList.length > 0 ? (
                            <>
                                <Button
                                    outlined
                                    label='이전'
                                    icon='keyboard_arrow_left'
                                    style={{ float: 'left' }}
                                    onClick={() => {
                                        this.tomorrow.prev()
                                    }}
                                />
                                <Button
                                    outlined
                                    label='이후'
                                    trailingIcon='keyboard_arrow_right'
                                    style={{ float: 'right' }}
                                    onClick={() => {
                                        this.tomorrow.next()
                                    }}
                                />
                            </>
                        ) : (
                            <p style={{ marginTop: '-20px' }}>
                                신청된 기상곡이 없어요!
                            </p>
                        )}
                    </>
                ) : (
                    <CircularProgress size={96} />
                )}
                <SnackbarQueue messages={this.messages} />
            </div>
        )
    }
}

export default Music
