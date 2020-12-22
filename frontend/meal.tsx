import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {Typography} from '@rmwc/typography'
import {
    Card,
    CardPrimaryAction,
    CardMedia,
    CardActions,
    CardActionIcons,
    CardActionIcon,
    CardActionButtons,
    CardActionButton
} from '@rmwc/card'
import {Dialog, DialogTitle, DialogContent, DialogActions, DialogButton} from '@rmwc/dialog'
import {CircularProgress} from '@rmwc/circular-progress'
import {Button} from '@rmwc/button'

import Siema from 'siema'

import {MealResponse, mealTime, getMealTime, getNextMealTime, getPrevMealTime} from '../scheme/api/meal'


interface MealProps {
    onClick: any,
    target: mealTime
}

interface MealState {
    number: number,
    loaded: boolean,
    data?: MealResponse,
    imageBlobUrl: string
}

interface MearContainerState {
    detailOpened: boolean
}


class MealOne extends React.Component<MealProps, MealState> {
    constructor(props: MealProps) {
        super(props)
    }

    public componentDidMount() {
        this.refresh()
    }

    public refresh() {
        this.setState({loaded: false})

        setTimeout(() => {
            let tempData = {
                success: true,
                message: '',
                data: {
                    image: '/static/img/place_500_300.png',
                    menu: [
                        {
                            name: '피자'
                        },
                        {
                            name: '치킨'
                        },
                    ]
                }
            }
            this.setState({loaded: true, data: tempData})
            fetch(this.state.data.data.image).then(res => res.blob()).then(img => {
                this.setState({imageBlobUrl: URL.createObjectURL(img)})
            })
        }, 1000)

        /*
        fetch(CreateURL('api', 'meal'))
            .then(response => response.json())
            .then(response => this.setState(response))
        */
    }

    public render() {
        let menuText = [<p>메뉴를 불러올 수 없어요!</p>]
        try {
            menuText = this.state.data.data.menu.map(menu => {
                return <>
                    <p>{menu.name}</p>
                </>
            })
        } catch (e) {

        }
        return <Card style={{margin: '20px'}}>
            <CardPrimaryAction onClick={this.props.onClick}>
                {this.state?.imageBlobUrl ?
                    <CardMedia sixteenByNine style={{backgroundImage: `url(${this.state.imageBlobUrl})`}}/> :
                    <div style={{
                        width: '100%',
                        height: '200px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}><CircularProgress size={96}/></div>}
                <div style={{padding: '0 1rem 1rem 1rem'}}>
                    <Typography use="headline6" tag="h2">
                        {this.props.target.month}월 {this.props.target.day}일 {['조식', '중식', '석식'][this.props.target.type]}
                    </Typography>
                    {this.state?.loaded ? <Typography use="body1" tag="div" theme="textSecondaryOnBackground">
                        {menuText}
                    </Typography> : <CircularProgress size="xlarge"/>}
                </div>
            </CardPrimaryAction>
            <CardActions>
                <CardActionButtons>
                    <CardActionButton onClick={this.props.onClick}>자세히 보기</CardActionButton>
                </CardActionButtons>
                <CardActionIcons>
                    <CardActionIcon icon="thumb_up"/>
                    <CardActionIcon icon="thumb_down"/>
                </CardActionIcons>
            </CardActions>
        </Card>
    }
}

class Meal extends React.Component<any, MearContainerState> {
    private siema: Siema
    private prevIndex: number
    private animationDuration: number
    private elementList: JSX.Element[]
    private beginTime: mealTime
    private endTime: mealTime
    private elementPerPage: number

    constructor(props: {}) {
        super(props)
        this.setState({detailOpened: false})
        this.prevIndex = 1
        this.animationDuration = 300
        this.handleChange = this.handleChange.bind(this)
        this.beginTime = this.endTime = getMealTime()
        this.beginTime = getPrevMealTime(this.beginTime)

        if (document.documentElement.offsetWidth < 700) this.elementPerPage = 1
        else if (document.documentElement.offsetWidth < 1020) this.elementPerPage = 2
        else if (document.documentElement.offsetWidth < 1440) this.elementPerPage = 3
        else if (document.documentElement.offsetWidth < 1660) this.elementPerPage = 4
        else this.elementPerPage = 5

        this.elementList = [] as JSX.Element[]
        this.elementList.push(<MealOne onClick={() => {
            this.setState({detailOpened: true})
        }} target={this.beginTime}/>)
        this.elementList.push(<MealOne onClick={() => {
            this.setState({detailOpened: true})
        }} target={this.endTime}/>)
        for (let i = 0; i < this.elementPerPage; i++) {
            this.endTime = getNextMealTime(this.endTime)
            this.elementList.push(<MealOne onClick={() => {
                this.setState({detailOpened: true})
            }} target={this.endTime}/>)
        }
    }

    public componentDidMount() {
        this.siema = new Siema({
            selector: '#meal-container',
            duration: this.animationDuration,
            easing: 'ease-out',
            perPage: this.elementPerPage,
            startIndex: 1,
            draggable: true,
            multipleDrag: false,
            threshold: 50,
            loop: false,
            onChange: this.handleChange,
        })
    }

    public componentWillUnmount() {
        this.siema.destroy()
    }

    private static createCarouselItem(el: JSX.Element) {
        const wrap = document.createElement('div')
        ReactDOM.render(el, wrap)
        return wrap
    }


    private handleChange() {
        const curIndex = this.siema.currentSlide
        if (curIndex === 0) {
            this.beginTime = getPrevMealTime(this.beginTime)
            this.elementList.unshift(<MealOne onClick={() => {
                this.setState({detailOpened: true})
            }} target={this.beginTime}/>)
            setTimeout(() => {
                this.siema.prepend(Meal.createCarouselItem(<MealOne onClick={() => {
                    this.setState({detailOpened: true})
                }} target={this.beginTime}/>))
            }, this.animationDuration)

        } else if (curIndex >= this.elementList.length - this.elementPerPage) {
            this.endTime = getNextMealTime(this.endTime)
            this.elementList.push(<MealOne onClick={() => {
                this.setState({detailOpened: true})
            }} target={this.endTime}/>)
            setTimeout(() => {
                this.siema.append(Meal.createCarouselItem(<MealOne onClick={() => {
                    this.setState({detailOpened: true})
                }} target={this.endTime}/>))
            }, this.animationDuration)
        }

    }

    public render() {
        return <div>
            <Typography use="headline3">급식</Typography>
            <Typography use="subtitle1" style={{marginLeft: '10px'}}>급식 식단표를 확인하거나 급식을 평가할 수 있어요.</Typography>
            <br/>
            <Dialog open={this.state?.detailOpened} onClose={() => {
                this.setState({detailOpened: false})
            }}>
                <DialogTitle>급식 정보</DialogTitle>
                <DialogContent>부울</DialogContent>
                <DialogActions>
                    <DialogButton action="close">닫기</DialogButton>
                </DialogActions>
            </Dialog>
            <div id="meal-container" style={{padding: '1px', margin: '10px'}}>
                {this.elementList}
            </div>
            <Button outlined label="이전" icon="keyboard_arrow_left" style={{float: 'left'}} onClick={() => {
                this.siema.prev()
            }}/>
            <Button outlined label="이후" trailingIcon="keyboard_arrow_right" style={{float: 'right'}} onClick={() => {
                this.siema.next()
            }}/>
        </div>
    }
}

export default Meal
