import * as React from 'react'
import { Typography } from '@rmwc/typography'

let today = new Date()
let currentYear = today.getFullYear()

export default function Footer() {
    return (
        <div
            style={{
                textAlign: 'center',
                alignSelf: 'flex-end',
                width: 'calc(100vw - 40px)',
            }}>
            <footer
                style={{
                    width: 'calc(100vw - 40px)',
                    textAlign: 'center',
                    color: 'white',
                }}>
                <br />
                <br />
                <Typography use='headline4'>IASA PORTAL</Typography>
                <br />
                <Typography use='subtitle1'>
                    Made with ♥ by 2019-{currentYear} club NULL;
                </Typography>
                <br />
                <br />
                <a
                    style={{
                        color: 'white',
                        textDecoration: 'none',
                        margin: '15px',
                    }}
                    href='//iasa.kr/terms'>
                    이용약관
                </a>
                <a
                    style={{
                        color: 'white',
                        textDecoration: 'none',
                        margin: '15px',
                    }}
                    href='//iasa.kr/userdata'>
                    개인정보 처리방침
                </a>
                <a
                    style={{
                        color: 'white',
                        textDecoration: 'none',
                        margin: '15px',
                    }}
                    href='//iasa.kr/opensource'>
                    오픈소스
                </a>
                <a
                    style={{
                        color: 'white',
                        textDecoration: 'none',
                        margin: '15px',
                    }}
                    href='//iasa.kr/openapi'>
                    OpenAPI
                </a>
            </footer>
        </div>
    )
}
