import * as React from "react"
import {Link, RouteComponentProps, withRouter} from "react-router-dom"

import {Drawer, DrawerHeader, DrawerTitle, DrawerSubtitle, DrawerContent, DrawerAppContent} from "@rmwc/drawer"
import {Button} from '@rmwc/button'
import {List, ListItem} from "@rmwc/list"
import {
    TopAppBar,
    TopAppBarRow,
    TopAppBarSection,
    TopAppBarNavigationIcon,
    TopAppBarTitle,
    TopAppBarFixedAdjust
} from "@rmwc/top-app-bar"

import '@rmwc/button/styles'
import '@rmwc/drawer/styles'
import '@rmwc/list/styles'
import '@rmwc/top-app-bar/styles'

import Counter from './counter'
import {Typography} from "@rmwc/typography";

function ListLink(props: { body: string, to: string }) {
    return (<Link className="--react-link" to={props.to}><ListItem>{props.body}</ListItem></Link>)
}


export default function MainView(props: { appCont: JSX.Element }) {
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
                onClose={() => setOpen(false)}>
            <DrawerHeader>
                <DrawerTitle>이서현</DrawerTitle>
                <DrawerSubtitle>Subtitle</DrawerSubtitle>
            </DrawerHeader>
            <DrawerContent>
                <List>
                    <ListLink body="메인" to="/"/>
                    <ListLink body="카운터" to="/counter"/>
                </List>
            </DrawerContent>
        </Drawer>
        <DrawerAppContent>
            {props.appCont}
        </DrawerAppContent>
    </>
}
