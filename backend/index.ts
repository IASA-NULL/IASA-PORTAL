/*
2021 SeoRii®. All right reserved.

index.ts
백엔드 코드의 Entry
 */

import cluster from 'cluster'
import createApp from './app'
import { uuid } from './util/random'
import os from 'os'
import { createNotify } from './util/notification'
import backgroundWork from './background'

declare const DEV_MODE: boolean

if (cluster.isMaster) {
    // 서버 시작 알림
    createNotify(
        [1],
        '서버가 시작됐어요.',
        `서버가 ${new Date().toLocaleString()}에 재시작됐어요. 예기치 않은 재시작일경우 서버를 확인해 보세요.`,
        ''
    )

    const cpuCount = os.cpus().length

    // 서버 실행 ID(서버 변경사항 발생시 토큰 만료 & 재로그인 요구용)
    const sid = uuid()

    // 멀티스레드(클러스터 사용)
    for (let i = 0; i < (DEV_MODE ? 1 : cpuCount * 8); i++) {
        cluster.fork({ SID: sid })
    }

    // 로그

    cluster.on('online', function (worker) {
        console.log('Worker ' + worker.process.pid + ' is online.')
    })

    // 튕기는 것은 정상적인 상황이 아님
    // -> 다시 실행!

    cluster.on('exit', function (worker, code, signal) {
        console.log('Worker ' + worker.process.pid + ' died. Restarting...')
        cluster.fork({ SID: sid })
    })

    // 백그라운드 작업
    backgroundWork()
} else {
    // 메인 프로세스
    createApp(process.env.SID)
}

// 웬만하면 여기로 넘어오지 않도록 할것!
process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err)
    createNotify([1], '오류가 발생했어요!', err.toString(), '')
})
