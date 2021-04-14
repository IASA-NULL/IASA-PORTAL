/*
2021 SeoRii®. All right reserved.

background.ts
백그라운드 작업 실행!

TODO : 급식 파싱 background 작업으로 만들기
 */

import mailParse from './mailParse'

declare const DEV_MODE: boolean

export default function backgroundWork() {
    if (!DEV_MODE) setInterval(mailParse, 5000)
}
