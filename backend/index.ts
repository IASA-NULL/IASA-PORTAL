import cluster from 'cluster'
import createApp from './app'
import { v4 as uuid } from 'uuid'
import os from 'os'

if (cluster.isMaster) {
    const cpuCount = os.cpus().length
    const sid = uuid()

    for (let i = 0; i < cpuCount; i++) {
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
