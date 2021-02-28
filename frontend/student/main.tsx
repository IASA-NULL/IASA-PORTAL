import * as React from 'react'
import { Link, withRouter } from 'react-router-dom'

import { Typography } from '@rmwc/typography'
import {
    Card,
    CardActionButton,
    CardActionButtons,
    CardActions,
    CardMedia,
    CardPrimaryAction,
} from '@rmwc/card'

class Main extends React.Component<any, {}> {
    public toMain() {
        this.props.history.push('/')
    }

    public render() {
        return (
            <>
                <Typography use='headline3'>
                    IASA PORTAL에 오신 것을 환영합니다!
                </Typography>
                <br />
                <br />
                <Typography use='headline5'>빠른 바로가기</Typography>
                <br />
                <Card style={{ width: '21rem', margin: '10px', float: 'left' }}>
                    <CardPrimaryAction>
                        <CardMedia
                            style={{
                                backgroundImage:
                                    'url(/static/img/illust/share.png)',
                                height: '220px',
                            }}
                        />
                        <div style={{ padding: '0 1rem 1rem 1rem' }}>
                            <Typography use='headline6' tag='h2'>
                                빠른 공유
                            </Typography>
                            <Typography
                                use='body1'
                                tag='div'
                                theme='textSecondaryOnBackground'>
                                파일을 교내 시스템 내에 빠르게 공유할 수 있어요.
                            </Typography>
                        </div>
                    </CardPrimaryAction>
                    <CardActions>
                        <CardActionButtons>
                            <Link to='/share'>
                                <CardActionButton>열기</CardActionButton>
                            </Link>
                        </CardActionButtons>
                    </CardActions>
                </Card>
                <Card style={{ width: '21rem', margin: '10px', float: 'left' }}>
                    <CardPrimaryAction>
                        <CardMedia
                            style={{
                                backgroundImage:
                                    'url(/static/img/illust/mail.png)',
                                height: '220px',
                            }}
                        />
                        <div style={{ padding: '0 1rem 1rem 1rem' }}>
                            <Typography use='headline6' tag='h2'>
                                메일
                            </Typography>
                            <Typography
                                use='body1'
                                tag='div'
                                theme='textSecondaryOnBackground'>
                                받은 이메일을 확인할 수 있어요.
                            </Typography>
                        </div>
                    </CardPrimaryAction>
                    <CardActions>
                        <CardActionButtons>
                            <Link to='/mail'>
                                <CardActionButton>열기</CardActionButton>
                            </Link>
                        </CardActionButtons>
                    </CardActions>
                </Card>
                <Card style={{ width: '21rem', margin: '10px', float: 'left' }}>
                    <CardPrimaryAction>
                        <CardMedia
                            style={{
                                backgroundImage:
                                    'url(/static/img/illust/myeonbul.png)',
                                height: '220px',
                            }}
                        />
                        <div style={{ padding: '0 1rem 1rem 1rem' }}>
                            <Typography use='headline6' tag='h2'>
                                면불
                            </Typography>
                            <Typography
                                use='body1'
                                tag='div'
                                theme='textSecondaryOnBackground'>
                                면불을 신청하거나 선생님의 승인 여부를 확인할 수
                                있어요.
                            </Typography>
                        </div>
                    </CardPrimaryAction>
                    <CardActions>
                        <CardActionButtons>
                            <Link to='/myeonbul'>
                                <CardActionButton>열기</CardActionButton>
                            </Link>
                        </CardActionButtons>
                    </CardActions>
                </Card>
                <Card style={{ width: '21rem', margin: '10px', float: 'left' }}>
                    <CardPrimaryAction>
                        <CardMedia
                            style={{
                                backgroundImage:
                                    'url(/static/img/illust/music.png)',
                                height: '220px',
                            }}
                        />
                        <div style={{ padding: '0 1rem 1rem 1rem' }}>
                            <Typography use='headline6' tag='h2'>
                                기상곡
                            </Typography>
                            <Typography
                                use='body1'
                                tag='div'
                                theme='textSecondaryOnBackground'>
                                기상곡을 확인할 수 있어요.
                            </Typography>
                        </div>
                    </CardPrimaryAction>
                    <CardActions>
                        <CardActionButtons>
                            <Link to='/music'>
                                <CardActionButton>열기</CardActionButton>
                            </Link>
                        </CardActionButtons>
                    </CardActions>
                </Card>
                <Card style={{ width: '21rem', margin: '10px', float: 'left' }}>
                    <CardPrimaryAction>
                        <CardMedia
                            style={{
                                backgroundImage:
                                    'url(/static/img/illust/penalty.png)',
                                height: '220px',
                            }}
                        />
                        <div style={{ padding: '0 1rem 1rem 1rem' }}>
                            <Typography use='headline6' tag='h2'>
                                상벌점
                            </Typography>
                            <Typography
                                use='body1'
                                tag='div'
                                theme='textSecondaryOnBackground'>
                                받은 상벌점을 확인할 수 있어요.
                            </Typography>
                        </div>
                    </CardPrimaryAction>
                    <CardActions>
                        <CardActionButtons>
                            <Link to='/penalty'>
                                <CardActionButton>열기</CardActionButton>
                            </Link>
                        </CardActionButtons>
                    </CardActions>
                </Card>
                <Card style={{ width: '21rem', margin: '10px', float: 'left' }}>
                    <CardPrimaryAction>
                        <CardMedia
                            style={{
                                backgroundImage:
                                    'url(/static/img/illust/meal.png)',
                                height: '220px',
                            }}
                        />
                        <div style={{ padding: '0 1rem 1rem 1rem' }}>
                            <Typography use='headline6' tag='h2'>
                                급식
                            </Typography>
                            <Typography
                                use='body1'
                                tag='div'
                                theme='textSecondaryOnBackground'>
                                급식 식단표를 확인하거나 급식을 평가할 수
                                있어요.
                            </Typography>
                        </div>
                    </CardPrimaryAction>
                    <CardActions>
                        <CardActionButtons>
                            <Link to='/meal'>
                                <CardActionButton>열기</CardActionButton>
                            </Link>
                        </CardActionButtons>
                    </CardActions>
                </Card>
                <Card style={{ width: '21rem', margin: '10px', float: 'left' }}>
                    <CardPrimaryAction>
                        <CardMedia
                            style={{
                                backgroundImage:
                                    'url(/static/img/illust/noti.png)',
                                height: '220px',
                            }}
                        />
                        <div style={{ padding: '0 1rem 1rem 1rem' }}>
                            <Typography use='headline6' tag='h2'>
                                알림
                            </Typography>
                            <Typography
                                use='body1'
                                tag='div'
                                theme='textSecondaryOnBackground'>
                                받은 알림들을 확인할 수 있어요.
                            </Typography>
                        </div>
                    </CardPrimaryAction>
                    <CardActions>
                        <CardActionButtons>
                            <Link to='/notifications'>
                                <CardActionButton>열기</CardActionButton>
                            </Link>
                        </CardActionButtons>
                    </CardActions>
                </Card>
                <Card style={{ width: '21rem', margin: '10px', float: 'left' }}>
                    <CardPrimaryAction>
                        <CardMedia
                            style={{
                                backgroundImage:
                                    'url(/static/img/illust/develop.png)',
                                height: '220px',
                            }}
                        />
                        <div style={{ padding: '0 1rem 1rem 1rem' }}>
                            <Typography use='headline6' tag='h2'>
                                개발 중!
                            </Typography>
                            <Typography
                                use='body1'
                                tag='div'
                                theme='textSecondaryOnBackground'>
                                IASA PORTAL은 아직 활발히 개발 중이에요. 곧
                                추가될 기능들도 기대해 주세요!
                            </Typography>
                        </div>
                    </CardPrimaryAction>
                </Card>
                <div style={{ clear: 'both' }} />
            </>
        )
    }
}

export default withRouter(Main)
