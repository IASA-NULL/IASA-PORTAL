import express from 'express'
import child_process from 'child_process'
import fs from 'fs'

import {Permission} from "../../scheme/api/auth"
import createResponse from "../createResponse"
import {getServerState, setServerState} from "../util/serverState";

const router = express.Router()

router.use((req, res, next) => {
    if (!req.auth) {
        res.status(401)
        res.send(createResponse(false, "먼저 로그인하세요."))
    } else if (req.auth.permission !== Permission.admin) {
        res.status(403)
        res.send(createResponse(false, "권한이 없어요."))
    } else {
        next()
    }
})

router.post('/update', (req, res, next) => {
    if (getServerState('build')) {
        res.send(createResponse(false, '사이트가 이미 빌드 중이에요.'))
    } else {
        setServerState('build', true)
        res.send(createResponse(true))
        child_process.spawn('start', ['cmd', '/c', 'C:\\Util\\update_server.bat', req.body.branch], {
            detached: true,
            stdio: ['ignore', 'ignore', 'ignore']
        })
    }
})

export default router