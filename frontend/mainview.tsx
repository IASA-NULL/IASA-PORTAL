import * as React from "react"
import {Link} from 'react-router-dom'

import {Drawer, DrawerHeader, DrawerTitle, DrawerSubtitle, DrawerContent, DrawerAppContent} from "@rmwc/drawer"
import {List} from "@rmwc/list"
import {
    TopAppBar,
    TopAppBarRow,
    TopAppBarSection,
    TopAppBarNavigationIcon,
    TopAppBarTitle,
    TopAppBarFixedAdjust,
    TopAppBarActionItem
} from "@rmwc/top-app-bar"
import {Grid, GridRow, GridCell} from '@rmwc/grid'
import {Theme, ThemeProvider} from '@rmwc/theme'
import {Typography} from '@rmwc/typography'
import {IconButton} from '@rmwc/icon-button'
import {SnackbarQueue, createSnackbarQueue} from '@rmwc/snackbar'
import {Menu, MenuItem, MenuSurfaceAnchor} from '@rmwc/menu'

import {ListLink, useForceUpdate} from './util'
import {token} from "../scheme/api/auth"


export const DefaultStudentNavList = [
    {
        type: 0,
        target: '/',
        body: '메인'
    },
    {
        type: 0,
        target: '/myeonbul',
        body: '면불'
    },
    {
        type: 0,
        target: '/meal',
        body: '급식'
    },
]

export const DefaultTeacherNavList = [
    {
        type: 0,
        target: '/',
        body: '메인'
    },
    {
        type: 0,
        target: '/myeonbul',
        body: '면불'
    },
    {
        type: 0,
        target: '/meal',
        body: '급식'
    },
]

export const TermsNavList = [
    {
        type: 2,
        target: 'cont_index',
        body: '약관'
    },
    {
        type: 2,
        target: 'cont_welcome',
        body: '인삿말'
    },
    {
        type: 2,
        target: 'cont_services',
        body: '서비스'
    },
    {
        type: 2,
        target: 'cont_account',
        body: '계정'
    },
    {
        type: 2,
        target: 'cont_contents',
        body: '콘텐츠'
    },
    {
        type: 2,
        target: 'cont_userdata',
        body: '개인정보 보호'
    },
    {
        type: 2,
        target: 'cont_otherright',
        body: '타인 존중'
    },
    {
        type: 2,
        target: 'cont_caution',
        body: '금지 사항'
    },
    {
        type: 2,
        target: 'cont_stop',
        body: '서비스의 제한'
    },
    {
        type: 2,
        target: 'cont_response',
        body: 'NULL의 책임'
    },
    {
        type: 2,
        target: 'cont_change',
        body: '서비스의 변경'
    },
    {
        type: 2,
        target: 'cont_hear',
        body: '사용자의 의견'
    },
    {
        type: 2,
        target: 'cont_alert',
        body: '약관의 변경'
    },
]

export const UserDataNavList = [
    {
        type: 2,
        target: 'cont_index',
        body: '개인정보 처리방침'
    },
    {
        type: 2,
        target: 'cont_why',
        body: '개인정보처리방침의 의의'
    },
    {
        type: 2,
        target: 'cont_collect',
        body: '수집하는 개인정보'
    },
    {
        type: 2,
        target: 'cont_usage',
        body: '수집한 개인정보의 이용'
    },
    {
        type: 2,
        target: 'cont_give',
        body: '개인정보의 제공 및 위탁'
    },
    {
        type: 2,
        target: 'cont_destroy',
        body: '개인정보의 파기'
    },
    {
        type: 2,
        target: 'cont_right',
        body: '이용자의 권리와 행사 방법'
    },
    {
        type: 2,
        target: 'cont_effort',
        body: '개인정보보호를 위한 NULL의 노력'
    },
    {
        type: 2,
        target: 'cont_who',
        body: '담당자 안내'
    },
    {
        type: 2,
        target: 'cont_where',
        body: '개인정보처리방침의 적용 범위'
    },
    {
        type: 2,
        target: 'cont_alert',
        body: '개정 전 고지 의무'
    },
]

export const OpensourceNavList = [
    {
        type: 2,
        target: 'cont_mdc',
        body: 'Material Components for the web'
    },
    {
        type: 2,
        target: 'cont_react',
        body: 'React'
    },
    {
        type: 2,
        target: 'cont_quaggaJS',
        body: 'quaggaJS'
    },
    {
        type: 2,
        target: 'cont_icons',
        body: 'Google Material Design Icons'
    },
]


function Navbar(props: { list: { type: number, target: string, body: string }[], accountInfo: token }) {
    const [drawerOpen, setDrawerOpen] = React.useState(window.innerWidth > 760)
    const [accountMenuOpen, setAccountMenuOpen] = React.useState(false)
    const closeIfModal = (() => {
        if (window.innerWidth <= 760) setDrawerOpen(false)
    })
    return <>
        <TopAppBar fixed style={{zIndex: 10}}>
            <TopAppBarRow>
                <TopAppBarSection alignStart>
                    {(props.list.length > 0) ?
                        <TopAppBarNavigationIcon icon="menu" onClick={() => setDrawerOpen(!drawerOpen)}/> : <></>}
                    <TopAppBarTitle><Link to="/" style={{textDecoration: 'none', color: 'white'}}>IASA
                        Portal</Link></TopAppBarTitle>
                </TopAppBarSection>
                <TopAppBarSection alignEnd>
                    <MenuSurfaceAnchor>
                        <Menu open={accountMenuOpen} onClose={evt => setAccountMenuOpen(false)}>
                            {props?.accountInfo?.id ? <>
                                <p style={{margin: '10px'}}>{props?.accountInfo?.id}</p>
                                <Link to="/mypage" style={{color: 'black'}}><MenuItem>마이페이지</MenuItem></Link>
                                <MenuItem onClick={() => {
                                    location.replace('/deauth')
                                }}>로그아웃</MenuItem>
                            </> : <MenuItem onClick={() => {
                                location.replace('/auth')
                            }}>로그인</MenuItem>}
                        </Menu>
                        <TopAppBarActionItem icon="account_circle"
                                             onClick={evt => setAccountMenuOpen(!accountMenuOpen)}/>
                    </MenuSurfaceAnchor>
                </TopAppBarSection>
            </TopAppBarRow>
        </TopAppBar>
        <TopAppBarFixedAdjust/>
        <Theme use={['background', 'textPrimaryOnDark']} wrap>
            <Drawer dismissible={window.innerWidth > 760} modal={window.innerWidth <= 760}
                    open={drawerOpen && (props.list.length > 0)}
                    onClose={() => setDrawerOpen(false)} style={{position: 'fixed'}}>
                {props?.accountInfo?.id ? <DrawerHeader>
                    <DrawerTitle>
                    <span title="Avatar"
                          className="rmwc-icon rmwc-icon--component material-icons rmwc-avatar rmwc-avatar--xlarge rmwc-avatar--has-image">
                        <div className="rmwc-avatar__icon"
                             style={{
                                 backgroundImage: `url("${props?.accountInfo?.avatarSrc}")`,
                                 backgroundSize: 'cover',
                                 width: '50px',
                                 height: '50px',
                                 borderRadius: '100px', marginTop: '20px', marginBottom: '10px'
                             }}/>
                    </span>
                        <br/>
                        {props?.accountInfo?.name}
                    </DrawerTitle>
                    <DrawerSubtitle>{props?.accountInfo?.id}@iasa.kr</DrawerSubtitle>
                </DrawerHeader> : <></>}
                <DrawerContent>
                    <List>
                        {
                            props.list.map((el) => {
                                return <ListLink body={el.body} to={el.target} onClick={closeIfModal} type={el.type}/>
                            })
                        }
                    </List>
                </DrawerContent>
            </Drawer>
        </Theme>
    </>
}

function Footer() {
    return <Theme use={['primaryBg', 'onPrimary']} wrap>
        <footer style={{position: 'relative', width: '100vw', zIndex: 7, textAlign: 'center'}}>
            <br/>
            <br/>
            <Typography use="headline4">IASA PORTAL</Typography>
            <br/>
            <Typography use="subtitle1">Made with ♥ by 2019-2021 club NULL;</Typography>
            <br/>
            <br/>
            <Grid>
                <GridRow>
                    <GridCell desktop={4} tablet={3} phone={1}>
                        <IconButton icon="facebook" tag="a" target="_blank"
                                    href="//www.facebook.com/인천과학예술영재학교-정보동아리-NULL-115441743332161"/>
                    </GridCell>
                    <GridCell desktop={4} tablet={2} phone={2}>
                        <IconButton icon="mail" tag="a" href="mailto:null@iasa.kr"/>
                    </GridCell>
                    <GridCell desktop={4} tablet={3} phone={1}>
                        <IconButton icon="call" tag="a" href="tel:010-3193-6628"/>
                    </GridCell>
                </GridRow>
                <br/>
                <br/>
                <GridRow>
                    <GridCell desktop={3} tablet={2} phone={2}>
                        <Link style={{color: 'white', textDecoration: 'none'}} to="/terms">이용약관</Link>
                    </GridCell>
                    <GridCell desktop={3} tablet={2} phone={2}>
                        <Link style={{color: 'white', textDecoration: 'none'}} to="/userdata">개인정보 처리방침</Link>
                    </GridCell>
                    <GridCell desktop={3} tablet={2} phone={2}>
                        <Link style={{color: 'white', textDecoration: 'none'}} to="/opensource">오픈소스</Link>
                    </GridCell>
                    <GridCell desktop={3} tablet={2} phone={2}>
                        <a style={{color: 'white', textDecoration: 'none'}} href="//docs.iasa.kr">OpenAPI</a>
                    </GridCell>
                </GridRow>
            </Grid>
            <div style={{height: '20px'}}/>
        </footer>
    </Theme>
}

class AppContentWrapper extends React.Component<any, {}> {
    private myRef: any

    constructor(props: { appCont: JSX.Element }) {
        super(props)
        this.myRef = React.createRef()
    }

    public componentWillUpdate() {
        this.myRef.current.className = 'before-fadein'
        setTimeout(() => {
            //@ts-ignore
            scrollObj.scroll(0)
            this.myRef.current.className = 'fadein'
        }, 100)
    }

    public render() {
        return (
            <div className="fadein" style={{padding: '20px'}} ref={this.myRef}>
                {this.props.appCont}
            </div>
        )
    }
}

export function MainView(props: { appCont: JSX.Element, navList?: { type: number, target: string, body: string }[], messages: any, accountInfo: token }) {
    let appCont = <AppContentWrapper appCont={props.appCont}/>
    let headerHeight = 48, footerHeight = 100
    if (document.querySelector('header')) headerHeight = document.querySelector('header').offsetHeight
    if (document.querySelector('footer')) footerHeight = document.querySelector('footer').offsetHeight
    if (!props.navList) props.navList = []
    const forceUpdate = useForceUpdate()
    document.addEventListener('load', () => {
        if (document.querySelector('header')) headerHeight = document.querySelector('header').offsetHeight
        if (document.querySelector('footer')) footerHeight = document.querySelector('footer').offsetHeight
        setTimeout(forceUpdate, 100)
    })
    return <>
        <Navbar list={props.navList} accountInfo={props.accountInfo}/>
        <DrawerAppContent
            style={{
                minHeight: `calc(100vh - ${headerHeight + footerHeight}px)`,
                transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}>
            {appCont}
        </DrawerAppContent>
        <SnackbarQueue messages={props.messages}/>
        <Footer/>
    </>
}
