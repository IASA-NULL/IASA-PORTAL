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

import createResponse from '../createResponse'

let jsonParser = bodyParser.json()
const router = express.Router()
router.use(jsonParser)

router.use('/meal', mealRouter)
router.use('/account', accountRouter)
router.use('/myeonbul', myeonbulRouter)
router.use('/music', musicRouter)
router.use('/admin', adminRouter)
router.use('/files', filesRouter)
router.use('/penalty', penaltyRouter)
router.use('/share', shareRouter)

router.use('*', (req, res, next) => {
    res.status(404)
    res.send(createResponse(false, '알 수 없는 요청이에요.'))
})

export default router
