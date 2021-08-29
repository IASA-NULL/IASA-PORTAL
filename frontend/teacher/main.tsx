import * as React from 'react'
import { withRouter } from 'react-router-dom'

import { Typography } from '@rmwc/typography'
import { CardLink } from '../util'

class Main extends React.Component<any, {}> {
    public toMain() {
        this.props.history.push('/')
    }

    public render() {
        let grid: string
        if (document.documentElement.offsetWidth < 550) grid = '1fr'
        else if (document.documentElement.offsetWidth < 1090) grid = '1fr 1fr'
        else if (document.documentElement.offsetWidth < 1440)
            grid = '1fr 1fr 1fr'
        else grid = '1fr 1fr 1fr 1fr'

        return (
            <>
                <Typography use='headline3'>
                    IASA PORTAL에 오신 것을 환영합니다!
                </Typography>
                <br />
                <br />
                <Typography use='headline5'>빠른 바로가기</Typography>
                <br />
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: grid,
                    }}>
                    <CardLink
                        img='/static/img/illust/share.png'
                        title='빠른 공유'
                        subtitle='파일을 교내 시스템 내에 빠르게 공유할 수 있어요.'
                        link='/share'
                    />
                    <CardLink
                        img='/static/img/illust/mail.png'
                        title='메일'
                        subtitle='받은 이메일을 확인할 수 있어요.'
                        link='/mail'
                    />
                    <CardLink
                        img='/static/img/illust/myeonbul.png'
                        title='면불'
                        subtitle='면불을 생성/승인하거나 면불대장을 출력할 수 있어요.'
                        link='/myeonbul'
                    />
                    <CardLink
                        img='/static/img/illust/penalty.png'
                        title='상벌점'
                        subtitle='학생들에게 상점/벌점을 부여할 수 있어요.'
                        link='/penalty'
                    />
                    <CardLink
                        img='/static/img/illust/music.png'
                        title='기상곡'
                        subtitle='기상곡을 확인할 수 있어요.'
                        link='/music'
                    />
                    <CardLink
                        img='/static/img/illust/print.png'
                        title='출력명부'
                        subtitle='출력명부를 확인할 수 있어요.'
                        link='/print'
                    />
                    <CardLink
                        img='/static/img/illust/meal.png'
                        title='급식'
                        subtitle='급식 식단표를 확인하거나 급식을 평가할 수 있어요.'
                        link='/meal'
                    />
                    <CardLink
                        img='/static/img/illust/noti.png'
                        title='알림'
                        subtitle='받은 알림들을 확인할 수 있어요.'
                        link='/notifications'
                    />
                    <CardLink
                        img='/static/img/illust/develop.png'
                        title='개발 중!'
                        subtitle='IASA PORTAL은 아직 활발히 개발 중이에요. 곧 추가될 기능들도 기대해 주세요!'
                    />
                </div>
            </>
        )
    }
}

export default withRouter(Main)
