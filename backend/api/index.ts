import express from 'express'
import bodyParser from 'body-parser'

import mealRouter from './meal'
import accountRouter from './account'
import myeonbulRouter from './myeonbul'
import musicRouter from './music'
import adminRouter from './admin'
import filesRouter from './files'
import penaltyRouter from './penalty'
import shareRouter from './share'
import mailRouter from './mail'
import notificationRouter from './notification'

import createResponse from '../createResponse'

let jsonParser = bodyParser.json()
const router = express.Router()
router.use(jsonParser)

router.use('/account', accountRouter)

router.use('*', (req, res, next) => {
    if (req.auth && req.auth.expired) {
        res.send(
            createResponse(
                false,
                '토큰이 만료되었어요. 페이지를 새로고침 해보세요.'
            )
        )
        return
    }
    next()
})

router.use('/meal', mealRouter)
router.use('/myeonbul', myeonbulRouter)
router.use('/music', musicRouter)
router.use('/admin', adminRouter)
router.use('/files', filesRouter)
router.use('/penalty', penaltyRouter)
router.use('/share', shareRouter)
router.use('/mail', mailRouter)
router.use('/notifications', notificationRouter)

router.use('*', (req, res) => {
    res.status(404)
    res.send(createResponse(false, '알 수 없는 요청이에요.'))
})

export default router
