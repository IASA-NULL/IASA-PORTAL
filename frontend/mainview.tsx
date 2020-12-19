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

import {ListLink, useForceUpdate} from './util'

function Navbar() {
    const [open, setOpen] = React.useState(window.innerWidth > 760)
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
                <DrawerTitle>이서현</DrawerTitle>
                <DrawerSubtitle>Subtitle</DrawerSubtitle>
            </DrawerHeader>
            <DrawerContent>
                <List>
                    <ListLink body="메인" to="/"/>
                    <ListLink body="카운터" to="/counter"/>
                    <ListLink body="404" to="/404"/>
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

export default function MainView(props: { appCont: JSX.Element }) {
    let headerHeight = 64, footerHeight = 100
    if (document.querySelector('header')) headerHeight = document.querySelector('header').offsetHeight
    if (document.querySelector('footer')) footerHeight = document.querySelector('footer').offsetHeight
    const forceUpdate = useForceUpdate()
    let resizeCounter: NodeJS.Timeout
    document.addEventListener('DOMContentLoaded', () => {
        clearTimeout(resizeCounter)
        resizeCounter = setTimeout(forceUpdate, 100)
    })
    window.addEventListener('resize', () => {
        clearTimeout(resizeCounter)
        resizeCounter = setTimeout(forceUpdate, 100)
    })
    return <>
        <Navbar/>
        <DrawerAppContent
            style={{minHeight: `calc(100vh - ${headerHeight + footerHeight}px)`}}>
            {props.appCont}
        </DrawerAppContent>
        <Footer/>
    </>
}
