import * as React from 'react'
import { Typography } from '@rmwc/typography'
import { BrIfMobile } from '../util'
import { Button } from '@rmwc/button'

export default function PROGRAM_NETWORK() {
    return (
        <>
            <Typography use='headline3'>네트워크 연결</Typography>
            <BrIfMobile />
            <Typography use='subtitle1' style={{ marginLeft: '10px' }}>
                교내 인터넷에 연결하려면 모두 다운로드하세요.
            </Typography>
            <br />
            <br />
            <Typography use='headline5'>NAC</Typography>
            <br />
            <br />
            <a href='https://s3.ap-northeast-2.amazonaws.com/public.iasa.kr/network/agent.exe'>
                <Button outlined label='다운로드' icon='get_app' />
            </a>
            <br />
            <br />
            <Typography use='headline5'>Ahnlab Policy Center</Typography>
            <br />
            <br />
            <a href='https://s3.ap-northeast-2.amazonaws.com/public.iasa.kr/network/agent.exe'>
                <Button outlined label='다운로드' icon='get_app' />
            </a>
            <br />
            <br />
            <Typography use='headline5'>내PC 지킴이</Typography>
            <br />
            <br />
            <a href='https://s3.ap-northeast-2.amazonaws.com/public.iasa.kr/network/mycom.exe'>
                <Button outlined label='다운로드' icon='get_app' />
            </a>
            <br />
            <br />
            <Typography use='headline5'>Privacy-i</Typography>
            <br />
            <br />
            <a href='https://s3.ap-northeast-2.amazonaws.com/public.iasa.kr/network/privacyi.exe'>
                <Button outlined label='다운로드' icon='get_app' />
            </a>
            <br />
            <br />
            <Typography use='headline5'>V3 Internet Security 9.0</Typography>
            <br />
            <br />
            <a href='https://s3.ap-northeast-2.amazonaws.com/public.iasa.kr/network/v3.exe'>
                <Button outlined label='다운로드' icon='get_app' />
            </a>
            <br />
            <br />
        </>
    )
}
