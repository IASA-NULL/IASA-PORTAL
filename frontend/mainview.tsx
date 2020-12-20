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
    TopAppBarFixedAdjust
} from "@rmwc/top-app-bar"
import {Grid, GridRow, GridCell} from '@rmwc/grid'
import {Theme} from '@rmwc/theme'
import {Typography} from '@rmwc/typography'
import {IconButton} from '@rmwc/icon-button'
import {Tooltip} from '@rmwc/tooltip'

import '@rmwc/button/styles'
import '@rmwc/drawer/styles'
import '@rmwc/list/styles'
import '@rmwc/top-app-bar/styles'
import '@rmwc/grid/styles'
import '@rmwc/theme/styles'
import '@rmwc/avatar/styles'
import '@rmwc/typography/styles'
import '@rmwc/icon-button/styles'
import '@rmwc/tooltip/styles'

import {ListLink, useForceUpdate} from './util'


export const DefaultStudentNavList = [
    {
        type: false,
        target: '/',
        body: '메인'
    },
    {
        type: false,
        target: '/counter',
        body: '카운터'
    },
    {
        type: false,
        target: '/myeonbul',
        body: '면불'
    }
]

export const TermsNavList = [
    {
        type: true,
        target: '#',
        body: '약관'
    },
    {
        type: true,
        target: '#',
        body: '인삿말'
    },
    {
        type: true,
        target: '#',
        body: '서비스'
    },
    {
        type: true,
        target: '#',
        body: '계정'
    },
    {
        type: true,
        target: '#',
        body: '콘텐츠'
    },
    {
        type: true,
        target: '#',
        body: '개인정보 보호'
    },
    {
        type: true,
        target: '#',
        body: '타인 존중'
    },
    {
        type: true,
        target: '#',
        body: '금지 사항'
    },
    {
        type: true,
        target: '#',
        body: '서비스의 제한'
    },
    {
        type: true,
        target: '#',
        body: 'NULL의 책임'
    },
    {
        type: true,
        target: '#',
        body: '서비스의 변경'
    },
    {
        type: true,
        target: '#',
        body: '사용자의 의견'
    },
    {
        type: true,
        target: '#',
        body: '약관의 변경'
    }
]


function Navbar(props: { list: { type: boolean, target: string, body: string }[] }) {
    const [open, setOpen] = React.useState(window.innerWidth > 760)
    const closeIfModal = (() => {
        if (window.innerWidth <= 760) setOpen(false)
    })
    return <>
        <TopAppBar fixed style={{zIndex: 10}}>
            <TopAppBarRow>
                <TopAppBarSection>
                    <TopAppBarNavigationIcon icon="menu" onClick={() => setOpen(!open)}/>
                    <TopAppBarTitle><Link to="/" style={{textDecoration: 'none', color: 'white'}}>IASA
                        Portal</Link></TopAppBarTitle>
                </TopAppBarSection>
            </TopAppBarRow>
        </TopAppBar>
        <TopAppBarFixedAdjust/>
        <Drawer dismissible={window.innerWidth > 760} modal={window.innerWidth <= 760} open={open}
                onClose={() => setOpen(false)} style={{position: 'fixed'}}>
            <DrawerHeader>
                <DrawerTitle>
                    <span title="Avatar"
                          className="rmwc-icon rmwc-icon--component material-icons rmwc-avatar rmwc-avatar--xlarge rmwc-avatar--has-image">
                        <div className="rmwc-avatar__icon"
                             style={{
                                 backgroundImage: 'url("/static/img/avatar.png")',
                                 backgroundSize: 'cover',
                                 width: '50px',
                                 height: '50px',
                                 borderRadius: '100px', marginTop: '20px', marginBottom: '10px'
                             }}/>
                    </span>
                    <br/>
                    이서현
                </DrawerTitle>
                <DrawerSubtitle>04seohyun@iasa.kr</DrawerSubtitle>
            </DrawerHeader>
            <DrawerContent>
                <List>
                    {
                        props.list.map((el) => {
                            return <ListLink body={el.body} to={el.target} onClick={closeIfModal}/>
                        })
                    }
                </List>
            </DrawerContent>
        </Drawer>
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
                        <Tooltip content="Facebook">
                            <IconButton icon="facebook" tag="a" target="_blank"
                                        href="//www.facebook.com/인천과학예술영재학교-정보동아리-NULL-115441743332161"/>
                        </Tooltip>
                    </GridCell>
                    <GridCell desktop={4} tablet={2} phone={2}>
                        <Tooltip content="null@iasa.kr">
                            <IconButton icon="mail" tag="a" href="mailto:null@iasa.kr"/>
                        </Tooltip>
                    </GridCell>
                    <GridCell desktop={4} tablet={3} phone={1}>
                        <Tooltip content="010-1234-5678">
                            <IconButton icon="call"/>
                        </Tooltip>
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

export function MainView(props: { appCont: JSX.Element, navList: { type: boolean, target: string, body: string }[] }) {
    let appCont = <AppContentWrapper appCont={props.appCont}/>
    let headerHeight = 48, footerHeight = 100
    if (document.querySelector('header')) headerHeight = document.querySelector('header').offsetHeight
    if (document.querySelector('footer')) footerHeight = document.querySelector('footer').offsetHeight
    const forceUpdate = useForceUpdate()
    document.addEventListener('load', () => {
        if (document.querySelector('header')) headerHeight = document.querySelector('header').offsetHeight
        if (document.querySelector('footer')) footerHeight = document.querySelector('footer').offsetHeight
        setTimeout(forceUpdate, 100)
    })
    return <>
        <Navbar list={props.navList}/>
        <DrawerAppContent
            style={{
                minHeight: `calc(100vh - ${headerHeight + footerHeight}px)`,
                transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}>
            {appCont}
        </DrawerAppContent>
        <Footer/>
    </>
}
