import * as React from "react"

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

import '@rmwc/button/styles'
import '@rmwc/drawer/styles'
import '@rmwc/list/styles'
import '@rmwc/top-app-bar/styles'
import '@rmwc/grid/styles'
import '@rmwc/theme/styles'
import '@rmwc/avatar/styles'

import {ListLink, useForceUpdate} from './util'


function Navbar() {
    const [open, setOpen] = React.useState(window.innerWidth > 760)
    const closeIfModal = (() => {
        if (window.innerWidth <= 760) setOpen(false)
    })
    return <>
        <TopAppBar fixed style={{zIndex: 10}}>
            <TopAppBarRow>
                <TopAppBarSection>
                    <TopAppBarNavigationIcon icon="menu" onClick={() => setOpen(!open)}/>
                    <TopAppBarTitle>IASA Portal</TopAppBarTitle>
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
                    <ListLink body="메인" to="/" onClick={closeIfModal}/>
                    <ListLink body="카운터" to="/counter" onClick={closeIfModal}/>
                    <ListLink body="면불" to="/myeonbul" onClick={closeIfModal}/>
                    <ListLink body="404" to="/404" onClick={closeIfModal}/>
                </List>
            </DrawerContent>
        </Drawer>
    </>
}

function Footer() {
    return <Theme use={['primaryBg', 'onPrimary']} wrap>
        <footer style={{position: 'relative', width: '100vw', zIndex: 7}}>
            <Grid>
                <GridRow>
                    <GridCell span={6}>1</GridCell>
                    <GridCell span={6}>
                        <GridRow>
                            <GridCell span={6}>a</GridCell>
                            <GridCell span={6}>b</GridCell>
                        </GridRow>
                    </GridCell>
                </GridRow>
            </Grid>
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

export default function MainView(props: { appCont: JSX.Element }) {
    let appCont = <AppContentWrapper appCont={props.appCont}/>
    let headerHeight = 48, footerHeight = 100
    if (document.querySelector('header')) headerHeight = document.querySelector('header').offsetHeight
    if (document.querySelector('footer')) footerHeight = document.querySelector('footer').offsetHeight
    const forceUpdate = useForceUpdate()
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(forceUpdate, 500)
    })
    return <>
        <Navbar/>
        <DrawerAppContent
            style={{minHeight: `calc(100vh - ${headerHeight + footerHeight}px)`}}>
            {appCont}
        </DrawerAppContent>
        <Footer/>
    </>
}
