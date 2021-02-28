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
                        img='/static/img/illust/vcs.png'
                        title='사이트 업데이트'
                        subtitle='깃허브에서 사이트의 새 버전을 가져와서 업데이트해요.'
                        link='/update'
                    />
                    <CardLink
                        img='/static/img/illust/signup.png'
                        title='가입 코드 발급'
                        subtitle='사용자가 가입할 수 있도록 코드를 발급해요.'
                        link='/user/code'
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
