import express from 'express'

import {Permission} from "../../scheme/api/auth"
import createResponse from "../createResponse"

const router = express.Router()

router.get('/info', (req, res, next) => {
    res.send(createResponse(req.auth ?? {permission: Permission.none}))
})

router.post('/username', (req, res, next) => {
    if (req.body.id === 'hi') res.send(createResponse('이서현'))
    else {
        res.status(404)
        res.send(createResponse(false, "아이디가 존재하지 않아요."))
    }
})

router.use('*', (req, res, next) => {
    res.send({
        success: false,
        message: '알 수 없는 요청입니다.'
    })
})

export default router
