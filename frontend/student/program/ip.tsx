import * as React from 'react'
import { Typography } from '@rmwc/typography'
import { BrIfMobile } from '../../util'
import { Button } from '@rmwc/button'

export default function PROGRAM_IP() {
    return (
        <>
            <Typography use='headline3'>IP</Typography>
            <BrIfMobile />
            <Typography use='subtitle1' style={{ marginLeft: '10px' }}>
                아주 간편한 IP 변경 프로그램
            </Typography>
            <br />
            <br />
            <Typography use='headline5'>다운로드</Typography>
            <BrIfMobile />
            <Typography use='subtitle2' style={{ marginLeft: '10px' }}>
                V 4.2.1
            </Typography>
            <br />
            <br />
            <a href='https://github.com/IASA-Null/iasa-ip/releases/latest/download/IP.exe'>
                <Button raised label='다운로드' icon='get_app' />
            </a>
            <br />
            <br />
            <Typography use='headline5'>이전 버전</Typography>
            <br />
            <br />
            <a href='https://github.com/IASA-Null/iasa-ip/releases/download/4.2.1/IP_4_2_1.exe'>
                <Button outlined label='4.2.1' icon='get_app' />
            </a>
            <p>다크 모드 사용 여부를 수동으로 지정할 수 있게 했어요.</p>
            <p>알림창에 블러 효과를 적용했어요.</p>
            <br />

            <a href='https://github.com/IASA-Null/iasa-ip/releases/download/4.2.0/IP_4_2_0.exe'>
                <Button outlined label='4.2.0' icon='get_app' />
            </a>
            <p>블러 효과를 적용했어요.</p>
            <p>다크 모드를 지원해요.</p>
            <p>IP 변경속도가 빨라졌어요.</p>
            <br />

            <a href='https://github.com/IASA-Null/iasa-ip/releases/download/4.1.0/IP_4_1_0.exe'>
                <Button outlined label='4.1.0' icon='get_app' />
            </a>
            <br />
            <br />

            <a href='https://github.com/IASA-Null/iasa-ip/releases/download/4.0.8/IP_4_0_8.exe'>
                <Button outlined label='4.0.8' icon='get_app' />
            </a>
            <br />
            <br />

            <a href='https://github.com/IASA-Null/iasa-ip/releases/download/4.0.7/IP_4_0_7.exe'>
                <Button outlined label='4.0.7' icon='get_app' />
            </a>
            <br />
            <br />

            <a href='https://github.com/IASA-Null/iasa-ip/releases/download/4.0.6/IP_4_0_6.exe'>
                <Button outlined label='4.0.6' icon='get_app' />
            </a>
            <p>알림창이 가끔씩 닫히지 않는 문제를 해결했어요.</p>
            <br />

            <a href='https://github.com/IASA-Null/iasa-ip/releases/download/4.0.5/IP_4_0_5.exe'>
                <Button outlined label='4.0.5' icon='get_app' />
            </a>
            <p>
                이제 프로그램이 컴퓨터를 킬 때 관리자 권한으로 자동으로
                실행돼요.
            </p>
            <br />

            <a href='https://github.com/IASA-Null/iasa-ip/releases/download/4.0.4/IP_4_0_4.exe'>
                <Button outlined label='4.0.4' icon='get_app' />
            </a>
            <p>자동 실행 오류를 고쳤어요.</p>
            <br />

            <a href='https://github.com/IASA-Null/iasa-ip/releases/download/4.0.3/IP_4_0_3.exe'>
                <Button outlined label='4.0.3' icon='get_app' />
            </a>
            <p>이 버전부터 자동 업데이트가 강제돼요.</p>
            <p>알림 기능을 개선했어요.</p>
            <br />

            <a href='https://github.com/IASA-Null/iasa-ip/releases/download/4.0.2/IP_4_0_2.exe'>
                <Button outlined label='4.0.2' icon='get_app' />
            </a>
            <p>자동 업데이트 관련 문제를 해결했어요.</p>
            <br />

            <a href='https://github.com/IASA-Null/iasa-ip/releases/download/4.0.1/IP_4_0_1.exe'>
                <Button outlined label='4.0.1' icon='get_app' />
            </a>
            <p>이제 32비트 운영체제도 지원해요.</p>
            <br />

            <a href='https://github.com/IASA-Null/iasa-ip/releases/download/4.0.0/IP_4_0_0.exe'>
                <Button outlined label='4.0.0' icon='get_app' />
            </a>
            <p>Electron 기반으로 프로그램을 다시 개발했어요!</p>
            <p>IP를 자동으로 변경해요.</p>
            <p>컴퓨터를 킬 때 자동으로 실행돼요.</p>
            <br />

            <a href='https://github.com/IASA-Null/iasa-ip/releases/download/3.2.2/IP_3_2_2.exe'>
                <Button outlined label='3.2.2' icon='get_app' />
            </a>
            <p>이제 더 많은 컴퓨터에서 작동해요.</p>
            <br />

            <a href='https://github.com/IASA-Null/iasa-ip/releases/download/3.2.1/IP_3_2_1.exe'>
                <Button outlined label='3.2.1' icon='get_app' />
            </a>
            <p>자동 업데이트 관련 문제를 해결했어요.</p>
            <p>프로그램이 강제종료 되는 문제를 해결했어요.</p>
            <br />

            <a href='https://github.com/IASA-Null/iasa-ip/releases/download/3.2.0/IP_3_2_0.exe'>
                <Button outlined label='3.2.0' icon='get_app' />
            </a>
            <p>자동 업데이트 관련 문제를 해결했어요.</p>
            <p>프로그램이 느리게 실행되는 문제를 해결했어요.</p>
            <p>폰트 관련 문제를 해결했어요.</p>
            <br />

            <a href='https://github.com/IASA-Null/iasa-ip/releases/download/3.1.1/IP_3_1_1.exe'>
                <Button outlined label='3.1.1' icon='get_app' />
            </a>
            <p>버그를 수정했어요.</p>
            <br />

            <a href='https://github.com/IASA-Null/iasa-ip/releases/download/3.0.0/IP_3_0_0.exe'>
                <Button outlined label='3.0.0' icon='get_app' />
            </a>
            <p>IP의 첫 버전이에요.</p>
            <br />
        </>
    )
}
