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
import printRouter from './print'

import ipRouter from './ip'

import createResponse from '../createResponse'
import { getServerFlag } from '../util/serverState'

let jsonParser = bodyParser.json()
const router = express.Router()

router.use((req, res, next) => {
    if (getServerFlag('build')) {
        res.status(503)
        res.set('Cache-Control', 'no-store')
        res.send(
            createResponse(false, '사이트가 점검 중이에요. 새로고침 해보세요.')
        )
    } else next()
})

router.use(jsonParser)

router.use('/account', accountRouter)

router.use('*', (req, res, next) => {
    if (req.auth && req.auth.expired) {
        res.status(403)
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
router.use('/print', printRouter)
router.use('/ip', ipRouter)

router.use('*', (req, res) => {
    res.status(404)
    res.send(createResponse(false, '알 수 없는 요청이에요.'))
})

export default router
