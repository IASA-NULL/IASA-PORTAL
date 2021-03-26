import cluster from 'cluster'
import createApp from './app'
import { uuid } from './util/random'
import os from 'os'
import { createNotify } from './util/notification'

declare const DEV_MODE: boolean

if (cluster.isMaster) {
    createNotify(
        [1],
        '서버가 시작됐어요.',
        '예기치 않은 재시작일경우 서버를 확인해 보세요.',
        ''
    )
    const cpuCount = os.cpus().length
    const sid = uuid()

    for (let i = 0; i < (DEV_MODE ? 1 : cpuCount * 8); i++) {
        cluster.fork({ SID: sid })
    }

    cluster.on('online', function (worker) {
        console.log('Worker ' + worker.process.pid + ' is online.')
    })

    cluster.on('exit', function (worker, code, signal) {
        console.log('Worker ' + worker.process.pid + ' died. Restarting...')
        cluster.fork({ SID: sid })
    })
} else {
    createApp(process.env.SID)
}

process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err)
})
