import express from 'express'
import bodyParser from "body-parser"

import getMeal from "./meal"
import accountRouter from "./account"
import myeonbulRouter from "./myeonbul"

import {MealResponse} from "../../scheme/api/meal"
import createResponse from "../createResponse"

let jsonParser = bodyParser.json()
const router = express.Router()
router.use(jsonParser)

router.post('/meal', (req, res, next) => {
    getMeal(req.body).then((mealData: MealResponse) => {
        if (!mealData.success) res.status(404)
        res.send(mealData)
    }).catch((e) => {
        res.status(500)
        res.send(createResponse(false, "급식 정보를 불러올 수 없어요."))
    })
})

router.use('/account', accountRouter)
router.use('/myeonbul', myeonbulRouter)

router.use('*', (req, res, next) => {
    res.send(createResponse(false, "알 수 없는 요청이에요."))
})

export default router
