import express from 'express'
import bodyParser from "body-parser"

import getMeal from "./meal"
import accountRouter from "./account"

import {Permission} from "../../scheme/api/auth"
import {MealResponse} from "../../scheme/api/meal"

let jsonParser = bodyParser.json()
const router = express.Router()
router.use(jsonParser)

router.post('/meal', (req, res, next) => {
    getMeal(req.body).then((mealData: MealResponse) => {
        if (!mealData.success) res.status(404)
        res.send(mealData)
    }).catch((e) => {
        res.status(500)
        res.send({
            success: false,
            message: '급식 정보를 불러올 수 없어요.'
        })
    })
})

router.get('/info', (req, res, next) => {
    res.send(req.auth ?? {permission: Permission.none})
})

router.use('/account', accountRouter)

router.use('*', (req, res, next) => {
    res.send({
        success: false,
        message: '알 수 없는 요청입니다.'
    })
})

export default router
