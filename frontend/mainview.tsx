import * as React from 'react'
import { Link } from 'react-router-dom'

import {
    Drawer,
    DrawerHeader,
    DrawerTitle,
    DrawerSubtitle,
    DrawerContent,
    DrawerAppContent,
} from '@rmwc/drawer'
import { List, CollapsibleList, SimpleListItem } from '@rmwc/list'
import {
    TopAppBar,
    TopAppBarRow,
    TopAppBarSection,
    TopAppBarNavigationIcon,
    TopAppBarTitle,
    TopAppBarFixedAdjust,
    TopAppBarActionItem,
} from '@rmwc/top-app-bar'
import { Grid, GridRow, GridCell } from '@rmwc/grid'
import { Theme } from '@rmwc/theme'
import { Typography } from '@rmwc/typography'
import { IconButton } from '@rmwc/icon-button'
import { Menu, MenuItem, MenuSurfaceAnchor } from '@rmwc/menu'

import { ListLink, useForceUpdate, LinkType } from './util'
import { token } from '../scheme/api/auth'
import createURL from '../scheme/url'

declare const DEV_MODE: boolean

export const DefaultStudentNavList = (closeIfModal: any) => {
    return (
        <>
            <ListLink
                body='메인'
                to='/'
                onClick={closeIfModal}
                type={LinkType.link}
                icon='home'
            />
            <ListLink
                body='빠른 공유'
                to='/share'
                onClick={closeIfModal}
                type={LinkType.link}
                icon='share'
            />
            <ListLink
                body='메일'
                to='/mail'
                onClick={closeIfModal}
                type={LinkType.link}
                icon='email'
            />
            <CollapsibleList
                defaultOpen={['/myeonbul', '/music'].includes(
                    window.location.pathname
                )}
                handle={
                    <SimpleListItem
                        text='신청'
                        graphic='playlist_add_check'
                        metaIcon='chevron_right'
                    />
                }>
                <div style={{ paddingLeft: '20px' }}>
                    <ListLink
                        body='면불'
                        to='/myeonbul'
                        onClick={closeIfModal}
                        type={LinkType.link}
                        icon='pan_tool'
                    />
                    <ListLink
                        body='기상곡'
                        to='/music'
                        onClick={closeIfModal}
                        type={LinkType.link}
                        icon='music_note'
                    />
                </div>
            </CollapsibleList>
            <CollapsibleList
                defaultOpen={['/penalty', '/meal'].includes(
                    window.location.pathname
                )}
                handle={
                    <SimpleListItem
                        text='생활'
                        graphic='night_shelter'
                        metaIcon='chevron_right'
                    />
                }>
                <div style={{ paddingLeft: '20px' }}>
                    <ListLink
                        body='벌점'
                        to='/penalty'
                        onClick={closeIfModal}
                        type={LinkType.link}
                        icon='assignment_late'
                    />
                    <ListLink
                        body='급식'
                        to='/meal'
                        onClick={closeIfModal}
                        type={LinkType.link}
                        icon='fastfood'
                    />
                </div>
            </CollapsibleList>
            <CollapsibleList
                defaultOpen={[
                    '/program/nac',
                    '/program/ip',
                    '/program/client',
                ].includes(window.location.pathname)}
                handle={
                    <SimpleListItem
                        text='프로그램'
                        graphic='folder'
                        metaIcon='chevron_right'
                    />
                }>
                <div style={{ paddingLeft: '20px' }}>
                    <ListLink
                        body='인터넷 연결 도구'
                        to='/program/nac'
                        onClick={closeIfModal}
                        type={LinkType.link}
                        icon='wysiwyg'
                    />
                    <ListLink
                        body='IP'
                        to='/program/ip'
                        onClick={closeIfModal}
                        type={LinkType.link}
                        icon='wysiwyg'
                    />
                    <ListLink
                        body='IASA CLIENT'
                        to='/program/client'
                        onClick={closeIfModal}
                        type={LinkType.link}
                        icon='wysiwyg'
                    />
                </div>
            </CollapsibleList>
        </>
    )
}

export const DefaultTeacherNavList = (closeIfModal: any) => {
    return (
        <>
            <ListLink
                body='메인'
                to='/'
                onClick={closeIfModal}
                type={LinkType.link}
                icon='home'
            />
            <ListLink
                body='빠른 공유'
                to='/share'
                onClick={closeIfModal}
                type={LinkType.link}
                icon='share'
            />
            <ListLink
                body='메일'
                to='/mail'
                onClick={closeIfModal}
                type={LinkType.link}
                icon='email'
            />
            <CollapsibleList
                defaultOpen={['/penalty', '/myeonbul'].includes(
                    window.location.pathname
                )}
                handle={
                    <SimpleListItem
                        text='학생지도'
                        graphic='auto_fix_normal'
                        metaIcon='chevron_right'
                    />
                }>
                <div style={{ paddingLeft: '20px' }}>
                    <ListLink
                        body='벌점'
                        to='/penalty'
                        onClick={closeIfModal}
                        type={LinkType.link}
                        icon='assignment_late'
                    />
                    <ListLink
                        body='면불'
                        to='/myeonbul'
                        onClick={closeIfModal}
                        type={LinkType.link}
                        icon='pan_tool'
                    />
                </div>
            </CollapsibleList>
            <ListLink
                body='기상곡'
                to='/music'
                onClick={closeIfModal}
                type={LinkType.link}
                icon='music_note'
            />
            <ListLink
                body='급식'
                to='/meal'
                onClick={closeIfModal}
                type={LinkType.link}
                icon='fastfood'
            />
        </>
    )
}

export const DefaultAdminNavList = (closeIfModal: any) => {
    return (
        <>
            <ListLink
                body='메인'
                to='/'
                onClick={closeIfModal}
                type={LinkType.link}
                icon='home'
            />
            <ListLink
                body='메일'
                to='/mail'
                onClick={closeIfModal}
                type={LinkType.link}
                icon='email'
            />
            <CollapsibleList
                defaultOpen={['/update'].includes(window.location.pathname)}
                handle={
                    <SimpleListItem
                        text='사이트 관리'
                        graphic='settings'
                        metaIcon='chevron_right'
                    />
                }>
                <div style={{ paddingLeft: '20px' }}>
                    <ListLink
                        body='업데이트'
                        to='/update'
                        onClick={closeIfModal}
                        type={LinkType.link}
                        icon='system_update'
                    />
                </div>
            </CollapsibleList>
            <CollapsibleList
                defaultOpen={['/user/code'].includes(window.location.pathname)}
                handle={
                    <SimpleListItem
                        text='사용자 관리'
                        graphic='account_circle'
                        metaIcon='chevron_right'
                    />
                }>
                <div style={{ paddingLeft: '20px' }}>
                    <ListLink
                        body='가입 코드 발급'
                        to='/user/code'
                        onClick={closeIfModal}
                        type={LinkType.link}
                        icon='recent_actors'
                    />
                </div>
            </CollapsibleList>
        </>
    )
}

export const TermsNavList = (closeIfModal: any) => {
    return (
        <>
            <ListLink
                body='약관'
                to='cont_index'
                onClick={closeIfModal}
                type={LinkType.js}
            />
            <ListLink
                body='인삿말'
                to='cont_welcome'
                onClick={closeIfModal}
                type={LinkType.js}
            />
            <ListLink
                body='서비스'
                to='cont_services'
                onClick={closeIfModal}
                type={LinkType.js}
            />
            <ListLink
                body='계정'
                to='cont_account'
                onClick={closeIfModal}
                type={LinkType.js}
            />
            <ListLink
                body='콘텐츠'
                to='cont_contents'
                onClick={closeIfModal}
                type={LinkType.js}
            />
            <ListLink
                body='개인정보 보호'
                to='cont_userdata'
                onClick={closeIfModal}
                type={LinkType.js}
            />
            <ListLink
                body='타인 존중'
                to='cont_otherright'
                onClick={closeIfModal}
                type={LinkType.js}
            />
            <ListLink
                body='금지 사항'
                to='cont_caution'
                onClick={closeIfModal}
                type={LinkType.js}
            />
            <ListLink
                body='서비스의 제한'
                to='cont_stop'
                onClick={closeIfModal}
                type={LinkType.js}
            />
            <ListLink
                body='NULL의 책임'
                to='cont_response'
                onClick={closeIfModal}
                type={LinkType.js}
            />
            <ListLink
                body='서비스의 변경'
                to='cont_change'
                onClick={closeIfModal}
                type={LinkType.js}
            />
            <ListLink
                body='사용자의 의견'
                to='cont_hear'
                onClick={closeIfModal}
                type={LinkType.js}
            />
            <ListLink
                body='약관의 변경'
                to='cont_alert'
                onClick={closeIfModal}
                type={LinkType.js}
            />
        </>
    )
}

export const UserDataNavList = (closeIfModal: any) => {
    return (
        <>
            <ListLink
                body='개인정보 처리방침'
                to='cont_index'
                onClick={closeIfModal}
                type={LinkType.js}
            />
            <ListLink
                body='개인정보처리방침의 의의'
                to='cont_why'
                onClick={closeIfModal}
                type={LinkType.js}
            />
            <ListLink
                body='수집하는 개인정보'
                to='cont_collect'
                onClick={closeIfModal}
                type={LinkType.js}
            />
            <ListLink
                body='수집한 개인정보의 이용'
                to='cont_usage'
                onClick={closeIfModal}
                type={LinkType.js}
            />
            <ListLink
                body='개인정보의 제공 및 위탁'
                to='cont_give'
                onClick={closeIfModal}
                type={LinkType.js}
            />
            <ListLink
                body='개인정보의 파기'
                to='cont_destroy'
                onClick={closeIfModal}
                type={LinkType.js}
            />
            <ListLink
                body='이용자의 권리와 행사 방법'
                to='cont_right'
                onClick={closeIfModal}
                type={LinkType.js}
            />
            <ListLink
                body='개인정보보호를 위한 NULL의 노력'
                to='cont_effort'
                onClick={closeIfModal}
                type={LinkType.js}
            />
            <ListLink
                body='담당자 안내'
                to='cont_who'
                onClick={closeIfModal}
                type={LinkType.js}
            />
            <ListLink
                body='개인정보처리방침의 적용 범위'
                to='cont_where'
                onClick={closeIfModal}
                type={LinkType.js}
            />
            <ListLink
                body='개정 전 고지 의무'
                to='cont_alert'
                onClick={closeIfModal}
                type={LinkType.js}
            />
        </>
    )
}

export const OpensourceNavList = (closeIfModal: any) => {
    return (
        <>
            <ListLink
                body='Material Components for the web'
                to='cont_mdc'
                onClick={closeIfModal}
                type={LinkType.js}
            />
            <ListLink
                body='React'
                to='cont_react'
                onClick={closeIfModal}
                type={LinkType.js}
            />
            <ListLink
                body='quaggaJS'
                to='cont_quaggaJS'
                onClick={closeIfModal}
                type={LinkType.js}
            />
            <ListLink
                body='Google Material Design Icons'
                to='cont_icons'
                onClick={closeIfModal}
                type={LinkType.js}
            />
        </>
    )
}

function Navbar(props: { list?: any; accountInfo: token }) {
    const [drawerOpen, setDrawerOpen] = React.useState(window.innerWidth > 760)
    const [accountMenuOpen, setAccountMenuOpen] = React.useState(false)
    const closeIfModal = () => {
        if (window.innerWidth <= 760) setDrawerOpen(false)
    }
    return (
        <>
            <TopAppBar
                fixed
                style={{
                    zIndex: 10,
                    borderBottom: 'solid 1px #ddd',
                    background: '#ffffff',
                    color: 'var(--mdc-theme-primary)',
                }}
                className={
                    window.location.pathname === '/about' ? '' : 'header'
                }>
                <TopAppBarRow>
                    <TopAppBarSection alignStart>
                        {props.list ? (
                            <TopAppBarNavigationIcon
                                icon='menu'
                                onClick={() => setDrawerOpen(!drawerOpen)}
                            />
                        ) : (
                            <></>
                        )}
                        <TopAppBarTitle>
                            <Link
                                to='/'
                                style={{
                                    textDecoration: 'none',
                                    color: 'white',
                                }}>
                                IASA Portal
                            </Link>
                        </TopAppBarTitle>
                    </TopAppBarSection>
                    <TopAppBarSection alignEnd>
                        <MenuSurfaceAnchor>
                            <Menu
                                open={accountMenuOpen}
                                onClose={() => setAccountMenuOpen(false)}>
                                {props?.accountInfo?.id ? (
                                    <>
                                        <p style={{ margin: '10px' }}>
                                            {props?.accountInfo?.id}
                                        </p>
                                        <Link
                                            to='/mypage'
                                            style={{ color: 'black' }}>
                                            <MenuItem>마이페이지</MenuItem>
                                        </Link>
                                        <MenuItem
                                            onClick={() => {
                                                window.location.replace(
                                                    createURL(
                                                        'account',
                                                        'signout'
                                                    )
                                                )
                                            }}>
                                            로그아웃
                                        </MenuItem>
                                    </>
                                ) : (
                                    <MenuItem
                                        onClick={() => {
                                            window.location.replace(
                                                createURL('account', 'signin') +
                                                    ('?next=' +
                                                        btoa(
                                                            window.location.href
                                                        ))
                                            )
                                        }}>
                                        로그인
                                    </MenuItem>
                                )}
                            </Menu>
                            <TopAppBarActionItem
                                icon='account_circle'
                                onClick={() =>
                                    setAccountMenuOpen(!accountMenuOpen)
                                }
                            />
                        </MenuSurfaceAnchor>
                    </TopAppBarSection>
                </TopAppBarRow>
            </TopAppBar>
            <TopAppBarFixedAdjust />
            <Theme use={['background', 'textPrimaryOnDark']} wrap>
                <Drawer
                    dismissible={window.innerWidth > 760}
                    modal={window.innerWidth <= 760}
                    open={drawerOpen && props.list}
                    onClose={() => setDrawerOpen(false)}
                    style={{
                        position: 'fixed',
                        background: '#fbfbff',
                    }}>
                    {props?.accountInfo?.id ? (
                        <DrawerHeader>
                            <DrawerTitle>
                                <span
                                    title='Avatar'
                                    className='rmwc-icon rmwc-icon--component material-icons rmwc-avatar rmwc-avatar--xlarge rmwc-avatar--has-image'>
                                    <div
                                        className='rmwc-avatar__icon'
                                        style={{
                                            backgroundImage: `url("${createURL(
                                                'api',
                                                'account',
                                                'avatar'
                                            )}")`,
                                            backgroundSize: 'cover',
                                            width: '50px',
                                            height: '50px',
                                            borderRadius: '100px',
                                            marginTop: '20px',
                                            marginBottom: '10px',
                                        }}
                                    />
                                </span>
                                <br />
                                {props?.accountInfo?.name}
                            </DrawerTitle>
                            <DrawerSubtitle>
                                {props?.accountInfo?.id}@iasa.kr
                            </DrawerSubtitle>
                        </DrawerHeader>
                    ) : (
                        <></>
                    )}
                    <DrawerContent style={{ height: 'calc(100% - 203px)' }}>
                        <List>
                            {props.list ? props.list(closeIfModal) : <></>}
                        </List>
                    </DrawerContent>
                </Drawer>
            </Theme>
        </>
    )
}

function Footer() {
    return (
        <Theme use={['primaryBg', 'onPrimary']} wrap>
            <footer
                style={{
                    position: 'relative',
                    width: '100%',
                    zIndex: 7,
                    textAlign: 'center',
                }}
                className='footer'>
                <br />
                <br />
                <Typography use='headline4'>IASA PORTAL</Typography>
                {DEV_MODE ? (
                    <Typography use='headline4'>(DEV MODE)</Typography>
                ) : (
                    <></>
                )}
                <br />
                <Typography use='subtitle1'>
                    Made with ♥ by 2019-2021 club NULL;
                </Typography>
                <br />
                <br />
                <Grid>
                    <GridRow>
                        <GridCell desktop={3} tablet={1} phone={0} />
                        <GridCell desktop={6} tablet={6} phone={4}>
                            <Grid>
                                <GridRow>
                                    <GridCell desktop={4} tablet={3} phone={1}>
                                        <IconButton
                                            icon='facebook'
                                            tag='a'
                                            target='_blank'
                                            href='//www.facebook.com/인천과학예술영재학교-정보동아리-NULL-115441743332161'
                                        />
                                    </GridCell>
                                    <GridCell desktop={4} tablet={2} phone={2}>
                                        <IconButton
                                            icon='mail'
                                            tag='a'
                                            href='mailto:null@iasa.kr'
                                        />
                                    </GridCell>
                                    <GridCell desktop={4} tablet={3} phone={1}>
                                        <IconButton
                                            icon='call'
                                            tag='a'
                                            href='tel:010-3193-6628'
                                        />
                                    </GridCell>
                                </GridRow>
                                <br />
                                <br />
                                <GridRow>
                                    <GridCell desktop={3} tablet={2} phone={2}>
                                        <Link
                                            style={{
                                                color: 'white',
                                                textDecoration: 'none',
                                            }}
                                            to='/terms'>
                                            이용약관
                                        </Link>
                                    </GridCell>
                                    <GridCell desktop={3} tablet={2} phone={2}>
                                        <Link
                                            style={{
                                                color: 'white',
                                                textDecoration: 'none',
                                            }}
                                            to='/userdata'>
                                            개인정보 처리방침
                                        </Link>
                                    </GridCell>
                                    <GridCell desktop={3} tablet={2} phone={2}>
                                        <Link
                                            style={{
                                                color: 'white',
                                                textDecoration: 'none',
                                            }}
                                            to='/opensource'>
                                            오픈소스
                                        </Link>
                                    </GridCell>
                                    <GridCell desktop={3} tablet={2} phone={2}>
                                        <a
                                            style={{
                                                color: 'white',
                                                textDecoration: 'none',
                                            }}
                                            href='//docs.iasa.kr'>
                                            OpenAPI
                                        </a>
                                    </GridCell>
                                </GridRow>
                            </Grid>
                        </GridCell>
                    </GridRow>
                </Grid>
                <div style={{ height: '20px' }} />
            </footer>
        </Theme>
    )
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
            // @ts-ignore
            scrollObj.scroll(0)
            this.myRef.current.className = 'fadein'
        }, 100)
    }

    public render() {
        return (
            <div
                className='fadein'
                style={{ padding: '20px' }}
                ref={this.myRef}>
                {this.props.appCont}
            </div>
        )
    }
}

export function MainView(props: {
    appCont: JSX.Element
    navList?: any
    accountInfo: token
}) {
    let appCont = <AppContentWrapper appCont={props.appCont} />
    let headerHeight = 48,
        footerHeight = 100
    if (document.querySelector('header'))
        headerHeight = document.querySelector('header').offsetHeight
    if (document.querySelector('footer'))
        footerHeight = document.querySelector('footer').offsetHeight
    const forceUpdate = useForceUpdate()
    document.addEventListener('load', () => {
        if (document.querySelector('header'))
            headerHeight = document.querySelector('header').offsetHeight
        if (document.querySelector('footer'))
            footerHeight = document.querySelector('footer').offsetHeight
        setTimeout(forceUpdate, 100)
    })
    return (
        <>
            <Navbar list={props.navList} accountInfo={props.accountInfo} />
            <DrawerAppContent
                style={{
                    transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    background: '#fbfbff',
                }}>
                <div
                    style={{
                        minHeight: `calc(100vh - ${
                            headerHeight + footerHeight
                        }px)`,
                        maxWidth: '1440px',
                        width: 'calc(100% - 40px)',
                    }}>
                    {appCont}
                </div>
                <Footer />
            </DrawerAppContent>
        </>
    )
}
