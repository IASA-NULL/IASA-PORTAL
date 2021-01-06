import * as React from "react";
import {Typography} from "@rmwc/typography";
import {Grid, GridCell, GridRow} from "@rmwc/grid"
import {IconButton} from "@rmwc/icon-button"
import {Link, RouteComponentProps, useHistory, withRouter} from "react-router-dom"
import {
    TopAppBar,
    TopAppBarActionItem,
    TopAppBarNavigationIcon,
    TopAppBarRow,
    TopAppBarSection,
    TopAppBarTitle
} from "@rmwc/top-app-bar"
import {Button} from "@rmwc/button"
import {Menu, MenuItem, MenuSurfaceAnchor} from "@rmwc/menu";


function About(props: RouteComponentProps) {
    const [accountMenuOpen, setAccountMenuOpen] = React.useState(false)
    return <>
        <TopAppBar fixed style={{zIndex: 10, background: 'transparent'}}>
            <TopAppBarRow>
                <TopAppBarSection alignStart>
                    <TopAppBarTitle><Link to="/about" style={{textDecoration: 'none', color: 'white'}}>IASA
                        Portal</Link></TopAppBarTitle>
                </TopAppBarSection>
                <TopAppBarSection alignEnd>
                    <MenuSurfaceAnchor>
                        <Menu open={accountMenuOpen} onClose={evt => setAccountMenuOpen(false)}>
                            <MenuItem onClick={() => {
                                location.replace('/signin')
                            }}>로그인</MenuItem>
                        </Menu>
                        <TopAppBarActionItem icon="account_circle"
                                             onClick={evt => setAccountMenuOpen(!accountMenuOpen)}/>
                    </MenuSurfaceAnchor>
                </TopAppBarSection>
            </TopAppBarRow>
        </TopAppBar>
        <video src="/static/video/back.mp4" autoPlay muted controls={false} loop style={{
            width: '100vw', height: '100vh', margin: '0', padding: '0', position: 'fixed', objectFit: 'cover'
        }}/>
        <div style={{
            width: 'calc(100vw - 40px)',
            height: 'calc(100vh - 40px)',
            margin: '0',
            padding: '20px',
            position: 'fixed',
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'column'
        }}>
            <div style={{height: '100px'}}/>
            <div style={{textAlign: 'center', color: 'white'}}>
                <Typography use="headline2">IASA PORTAL</Typography>
                <br/>
                <br/>
                <Typography use="headline4">인천과학예술영재학교 통합 학사포털</Typography>
                <br/>
                <br/>
                <br/>
                <Button outlined style={{
                    '--mdc-theme-primary': 'white',
                    borderColor: 'white',
                    padding: '20px',
                    fontSize: '20px'
                } as React.CSSProperties} onClick={() => {
                    location.replace('/signin')
                }}>로그인</Button>
            </div>
            <div style={{textAlign: 'center', alignSelf: 'flex-end', width: 'calc(100vw - 40px)'}}>
                <footer style={{width: 'calc(100vw - 40px)', textAlign: 'center', color: 'white'}}>
                    <br/>
                    <br/>
                    <Typography use="headline4">IASA PORTAL</Typography>
                    <br/>
                    <Typography use="subtitle1">Made with ♥ by 2019-2021 club NULL;</Typography>
                    <br/>
                    <br/>
                    <Grid>
                        <GridRow>
                            <GridCell desktop={3} tablet={1} phone={0}/>
                            <GridCell desktop={6} tablet={6} phone={4}>
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
                                            <Link style={{color: 'white', textDecoration: 'none'}}
                                                  to="/terms">이용약관</Link>
                                        </GridCell>
                                        <GridCell desktop={3} tablet={2} phone={2}>
                                            <Link style={{color: 'white', textDecoration: 'none'}} to="/userdata">개인정보
                                                처리방침</Link>
                                        </GridCell>
                                        <GridCell desktop={3} tablet={2} phone={2}>
                                            <Link style={{color: 'white', textDecoration: 'none'}}
                                                  to="/opensource">오픈소스</Link>
                                        </GridCell>
                                        <GridCell desktop={3} tablet={2} phone={2}>
                                            <a style={{color: 'white', textDecoration: 'none'}}
                                               href="//docs.iasa.kr">OpenAPI</a>
                                        </GridCell>
                                    </GridRow>
                                </Grid>
                            </GridCell>
                        </GridRow>
                    </Grid>
                    <div style={{height: '20px'}}/>
                </footer>
            </div>
        </div>
    </>
}

export default withRouter(About)
