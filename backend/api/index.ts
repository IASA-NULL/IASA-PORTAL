import express from 'express'
import bodyParser from "body-parser"

import getMeal from "./meal";
import {Permission} from "../../scheme/api/auth";

let jsonParser = bodyParser.json()
const router = express.Router()

router.post('/meal', jsonParser, (req, res, next) => {
    getMeal(req.body).then(mealData => {
        res.send(mealData)
    }).catch((e) => {
        res.send({
            success: false,
            message: '급식 정보를 불러올 수 없습니다.'
        })
    })
})

router.get('/info', (req, res, next) => {
    res.send(req.auth ?? {permission: Permission.none})
})

router.use('*', (req, res, next) => {
    res.send({
        success: false,
        message: '알 수 없는 요청입니다.'
    })
})

export default router
