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
import {createSnackbarQueue, SnackbarQueue} from '@rmwc/snackbar'
import {LinearProgress} from '@rmwc/linear-progress'
import {
    List,
    CollapsibleList,
    ListItem,
    ListItemText,
    ListItemPrimaryText,
    ListItemSecondaryText,
    SimpleListItem
} from '@rmwc/list'

import Siema from 'siema'

import {
    MealResponse,
    mealTime,
    getMealTime,
    getNextMealTime,
    getPrevMealTime,
    mealTimeToString,
    AllergicInfo
} from '../../scheme/api/meal'
import createURL from "../../scheme/url";
import meal from "../../backend/api/meal";
import {BrIfMobile} from "../util";


interface MealProps {
    onClick: any,
    target: mealTime,
    notify: any
}

interface MealState {
    number: number,
    loaded: boolean,
    data?: MealResponse,
    imageUrl: string
}

interface MearContainerState {
    detailOpened: boolean,
    selectedTime: mealTime,
    data?: MealResponse,
    detailLoaded: boolean,
    imageUrl: string
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
        fetch(createURL('api', 'meal'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.props.target)
        }).then(res => res.json()).then(data => {
            this.setState({loaded: true, data: data})
            if (!this.state.data.data.image) this.setState({imageUrl: 'none'})
            else this.setState({imageUrl: this.state.data.data.image})
        })
    }

    public render() {
        let menuText = [<p>{this.state?.data?.message}</p>], kcalInfo = <></>
        try {
            if (this.state.data.data.menu.length === 0) menuText = [<p>급식 정보가 없어요!</p>]
            else {
                menuText = this.state.data.data.menu.map(menu => {
                    return <>
                        <p>{menu.name}</p>
                    </>
                })
                kcalInfo = <>
                    <LinearProgress progress={this.state?.data?.data?.kcal / 1500} buffer={1}/>
                    <Typography use="subtitle1">
                        {this?.state?.data?.data?.kcal ? `${this?.state?.data?.data?.kcal}kcal` : '칼로리 정보가 없어요!'}
                    </Typography>
                </>
            }
        } catch (e) {

        }
        return <Card style={{margin: '20px'}}>
            <CardPrimaryAction onClick={this.props.onClick} data-meal_id={mealTimeToString(this.props.target)}>
                {this.state?.imageUrl ?
                    (this.state?.imageUrl === 'none' ? <></> :
                        <CardMedia sixteenByNine style={{backgroundImage: `url(${this.state?.imageUrl})`}}/>) :
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
                    {this.state?.loaded ? <>
                        {kcalInfo}
                        <Typography use="body1" tag="div" theme="textSecondaryOnBackground">
                            {menuText}
                        </Typography>
                    </> : <CircularProgress size="xlarge"/>}
                </div>
            </CardPrimaryAction>
            <CardActions>
                <CardActionButtons>
                    <CardActionButton onClick={this.props.onClick}>자세히 보기</CardActionButton>
                </CardActionButtons>
                <CardActionIcons>
                    <CardActionIcon onClick={() => {
                        this.props?.notify({
                            title: <b>아직 개발 중이에요.</b>,
                            body: '곧 급식을 평가할 수 있어요!',
                            icon: 'build',
                            dismissIcon: true
                        })()
                    }} icon="thumb_up"/>
                    <CardActionIcon onClick={() => {
                        this.props?.notify({
                            title: <b>아직 개발 중이에요.</b>,
                            body: '곧 급식을 평가할 수 있어요!',
                            icon: 'build',
                            dismissIcon: true
                        })()
                    }} icon="thumb_down"/>
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
    messages: any
    notify: any

    constructor(props: {}) {
        super(props)
        this.setState({detailOpened: false})
        this.prevIndex = 1
        this.animationDuration = 300
        this.handleChange = this.handleChange.bind(this)
        this.beginTime = this.endTime = getMealTime()
        this.beginTime = getPrevMealTime(this.beginTime)

        let qu = createSnackbarQueue()
        this.messages = qu.messages
        this.notify = qu.notify

        if (document.documentElement.offsetWidth < 700) this.elementPerPage = 1
        else if (document.documentElement.offsetWidth < 1020) this.elementPerPage = 2
        else if (document.documentElement.offsetWidth < 1440) this.elementPerPage = 3
        else this.elementPerPage = 4

        this.elementList = [] as JSX.Element[]
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
        });
        ((time: mealTime) => {
            this.elementList.push(<MealOne notify={this.notify} onClick={() => {
                this.getMealInfo.bind(this)(time)
            }} target={time}/>)
        })(this.beginTime);
        ((siema: Siema, time: mealTime) => {
            siema.append(Meal.createCarouselItem(<MealOne notify={this.notify} onClick={() => {
                this.getMealInfo.bind(this)(time)
            }} target={time}/>))
        })(this.siema, this.beginTime);
        ((time: mealTime) => {
            this.elementList.push(<MealOne notify={this.notify} onClick={() => {
                this.getMealInfo.bind(this)(time)
            }} target={time}/>)
        })(this.endTime);
        ((siema: Siema, time: mealTime) => {
            siema.append(Meal.createCarouselItem(<MealOne notify={this.notify} onClick={() => {
                this.getMealInfo.bind(this)(time)
            }} target={time}/>))
        })(this.siema, this.endTime);
        for (let i = 0; i < this.elementPerPage; i++) {
            this.endTime = getNextMealTime(this.endTime);
            ((time: mealTime) => {
                this.elementList.push(<MealOne notify={this.notify} onClick={() => {
                    this.getMealInfo.bind(this)(time)
                }} target={time}/>)
            })(this.endTime);
            ((siema: Siema, time: mealTime) => {
                siema.append(Meal.createCarouselItem(<MealOne notify={this.notify} onClick={() => {
                    this.getMealInfo.bind(this)(time)
                }} target={time}/>))
            })(this.siema, this.endTime);
        }
        this.siema.goTo(1)
    }

    public componentWillUnmount() {
        this.siema.destroy()
    }

    private static createCarouselItem(el: JSX.Element) {
        const wrap = document.createElement('div')
        ReactDOM.render(el, wrap)
        return wrap
    }

    public getMealInfo(time: mealTime) {
        this.setState({detailOpened: true, selectedTime: time, detailLoaded: false, imageUrl: ''})
        fetch(createURL('api', 'meal'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(time)
        }).then(res => res.json()).then(data => {
            this.setState({detailLoaded: true, data: data})
            if (!this.state.data.data.image) this.setState({imageUrl: 'none'})
            else this.setState({imageUrl: this.state.data.data.image})
        })
    }


    private handleChange() {
        const curIndex = this.siema.currentSlide
        if (curIndex === 0) {
            this.beginTime = getPrevMealTime(this.beginTime);
            ((time: mealTime) => {
                this.elementList.unshift(<MealOne notify={this.notify} onClick={() => {
                    this.getMealInfo.bind(this)(time)
                }} target={time}/>)
            })(this.beginTime);
            setTimeout(() => {
                ((siema: Siema, time: mealTime) => {
                    siema.prepend(Meal.createCarouselItem(<MealOne notify={this.notify} onClick={() => {
                        this.getMealInfo.bind(this)(time)
                    }} target={time}/>))
                })(this.siema, this.beginTime)
            }, this.animationDuration);

        } else if (curIndex >= this.elementList.length - this.elementPerPage) {
            this.endTime = getNextMealTime(this.endTime);
            ((time: mealTime) => {
                this.elementList.push(<MealOne notify={this.notify} onClick={() => {
                    this.getMealInfo.bind(this)(time)
                }} target={time}/>)
            })(this.endTime);
            setTimeout(() => {
                ((siema: Siema, time: mealTime) => {
                    siema.append(Meal.createCarouselItem(<MealOne notify={this.notify} onClick={() => {
                        this.getMealInfo.bind(this)(time)
                    }} target={time}/>))
                })(this.siema, this.endTime)
            }, this.animationDuration);
        }
    }

    public render() {
        let menuText = [<p>{this.state?.data?.message}</p>], kcalInfo = <></>, detailTable = <></>
        try {
            if (this.state.data.data.menu.length === 0) menuText = [<p>급식 정보가 없어요!</p>]
            else {
                menuText = this.state.data.data.menu.map(menu => {
                    return <>
                        <p>{menu.name}</p>
                    </>
                })
                kcalInfo = <>
                    <LinearProgress progress={this.state?.data?.data?.kcal / 1500} buffer={1}/>
                    <Typography use="subtitle1">
                        {this?.state?.data?.data?.kcal ? `${this?.state?.data?.data?.kcal}kcal` : '칼로리 정보가 없어요!'}
                    </Typography>
                </>
                detailTable = <List>
                    <CollapsibleList handle={<SimpleListItem
                        text="알레르기 정보"
                        graphic="sick"
                        metaIcon="chevron_right"
                        className="mdc-list--two-line"
                    />}>
                        {this?.state?.data?.data?.menu?.length ? this.state.data.data.menu.map(menu => {
                            return menu.allergicInfo.length ? <ListItem className="mdc-list--two-line">
                                <ListItemText>
                                    <ListItemPrimaryText>{menu.name}</ListItemPrimaryText>
                                    <ListItemSecondaryText>{
                                        menu.allergicInfo.map(allergicCode => {
                                            return `${AllergicInfo[allergicCode]}`
                                        }).join(', ')
                                    }</ListItemSecondaryText>
                                </ListItemText>
                            </ListItem> : null
                        }).filter(x => x) : <ListItem className="mdc-list--two-line">
                            <ListItemText>
                                <ListItemPrimaryText>알레르기 정보가 없어요!</ListItemPrimaryText>
                                <ListItemSecondaryText>:(</ListItemSecondaryText>
                            </ListItemText>
                        </ListItem>}
                    </CollapsibleList>
                    <CollapsibleList handle={<SimpleListItem
                        text="원산지"
                        graphic="location_on"
                        metaIcon="chevron_right"
                        className="mdc-list--two-line"
                    />}>
                        {this?.state?.data?.data?.origin?.length ? this.state.data.data.origin.map(originItem => {
                            return <ListItem className="mdc-list--two-line">
                                <ListItemText>
                                    <ListItemPrimaryText>{originItem.name}</ListItemPrimaryText>
                                    <ListItemSecondaryText>{originItem.origin}</ListItemSecondaryText>
                                </ListItemText>
                            </ListItem>
                        }) : <ListItem className="mdc-list--two-line">
                            <ListItemText>
                                <ListItemPrimaryText>원산지 정보가 없어요!</ListItemPrimaryText>
                                <ListItemSecondaryText>:(</ListItemSecondaryText>
                            </ListItemText>
                        </ListItem>}
                    </CollapsibleList>
                    <CollapsibleList handle={<SimpleListItem
                        text="영양분 정보"
                        graphic="science"
                        metaIcon="chevron_right"
                        className="mdc-list--two-line"
                    />}>
                        {this?.state?.data?.data?.energy?.length ? this.state.data.data.energy.map(originItem => {
                            return <ListItem className="mdc-list--two-line">
                                <ListItemText>
                                    <ListItemPrimaryText>{originItem.name}</ListItemPrimaryText>
                                    <ListItemSecondaryText>{originItem.value}{originItem.unit}</ListItemSecondaryText>
                                </ListItemText>
                            </ListItem>
                        }) : <ListItem className="mdc-list--two-line">
                            <ListItemText>
                                <ListItemPrimaryText>영양분 정보가 없어요!</ListItemPrimaryText>
                                <ListItemSecondaryText>:(</ListItemSecondaryText>
                            </ListItemText>
                        </ListItem>}
                    </CollapsibleList>
                </List>
            }
        } catch (e) {

        }
        return <div>
            <Typography use="headline3">급식</Typography>
            <BrIfMobile/>
            <Typography use="subtitle1" style={{marginLeft: '10px'}}>급식 식단표를 확인하거나 급식을 평가할 수 있어요.</Typography>
            <br/>
            <Dialog open={this.state?.detailOpened} onClose={() => {
                this.setState({detailOpened: false})
            }}>
                {this.state?.imageUrl ?
                    (this.state?.imageUrl === 'none' ? <></> :
                        <CardMedia sixteenByNine style={{backgroundImage: `url(${this.state?.imageUrl})`}}/>) :
                    <div style={{
                        width: '100%',
                        height: '200px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}><CircularProgress size={96}/></div>}
                <DialogTitle>{this.state?.selectedTime?.month}월 {this.state?.selectedTime?.day}일 {['조식', '중식', '석식'][this.state?.selectedTime?.type]}</DialogTitle>
                <DialogContent>
                    {this.state?.detailLoaded ? <>
                            {kcalInfo}
                            <Typography use="body1" tag="div" theme="textSecondaryOnBackground">
                                {menuText}
                            </Typography>
                            {detailTable}
                        </> :
                        <div style={{
                            width: '100%',
                            height: '200px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}><CircularProgress size={96}/></div>}
                </DialogContent>
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
            <br/>
            <br/>
            <div style={{height: '20px'}}/>
            <SnackbarQueue messages={this.messages}/>
        </div>
    }
}

export default Meal
