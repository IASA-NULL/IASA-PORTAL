import express from 'express'

import { Permission } from '../../scheme/api/auth'
import createResponse from '../createResponse'
import {
    MyeonbulDB,
    MyeonbulRequestListType,
    MyeonbulResponseType,
} from '../../scheme/api/myeonbul'
import db from '../util/db'
import {
    DB_CONNECT_ERROR,
    REQUIRE_PERMISSION_ERROR,
    REQUIRE_SIGNIN_ERROR,
} from '../../string/error'
import { User } from '../../scheme/user'
import { v4 as uuid } from 'uuid'

const router = express.Router()

router.use((req, res, next) => {
    if (!req.auth) {
        res.status(401)
        res.send(createResponse(false, REQUIRE_SIGNIN_ERROR))
    } else {
        next()
    }
})

router.post('/', async (req, res, next) => {
    let student, teacher
    const mid = uuid()
    if (req.auth.permission === Permission.student) {
        student = req.auth
        teacher = (await db.get('account', 'uid', req.body.teacher)) as User
    } else if (req.auth.permission === Permission.teacher) {
        teacher = req.auth
        student = (await db.get('account', 'uid', req.body.student)) as User
    } else {
        res.status(400)
        res.send(createResponse(false, '올바르지 않은 요청이에요.'))
        return
    }
    await db.set('myeonbul', {
        timeRange: req.body.timeRange,
        place: req.body.place,
        teacher: {
            uid: teacher.uid,
            name: teacher.name,
            type: teacher.permission,
        },
        target: {
            name: student.name,
            uid: student.uid,
            type: student.permission,
        },
        approved: MyeonbulResponseType.DENY,
        mid: mid,
        sid: student.uid,
        tid: teacher.uid,
        reason: req.body.reason,
    } as MyeonbulDB)
    res.send(createResponse(mid))
})

router.delete('/:mid', async (req, res, next) => {
    if (req.auth.permission === Permission.student) {
        const myeonbul = (await db.get(
            'myeonbul',
            'mid',
            req.params.mid
        )) as MyeonbulDB
        if (myeonbul.sid !== req.auth.uid) {
            res.status(403)
            res.send(createResponse(false, '자신의 면불만 삭제할 수 있어요.'))
            return
        }
    }
    await db.del('myeonbul', 'mid', req.params.mid)
})

router.put('/:mid/reponse', async (req, res, next) => {
    if (req.auth.permission === Permission.teacher) {
        if (
            req.body.type !== MyeonbulResponseType.ACCEPT &&
            req.body.type !== MyeonbulResponseType.DENY
        ) {
            res.status(400)
            res.send(createResponse(false, '올바르지 않은 요청이에요.'))
            return
        }
        await db.update('myeonbul', 'mid', req.params.mid, {
            approved: req.body.type,
        })
        res.send(createResponse(true))
    } else {
        res.status(403)
        res.send(createResponse(false, '교사만 면불 요청에 응답할 수 있어요.'))
    }
})

router.get('/', async (req, res, next) => {
    const myeonbulDB = await db.direct('myeonbul')
    let myeonbulList
    if (!myeonbulDB) {
        res.status(500)
        res.send(createResponse(false, DB_CONNECT_ERROR))
    }
    if (req.auth.permission === Permission.teacher) {
        myeonbulList = await myeonbulDB.find({ tid: req.auth.uid }).toArray()
    } else if (req.auth.permission === Permission.student) {
        myeonbulList = await myeonbulDB.find({ sid: req.auth.uid }).toArray()
    }
    if (!myeonbulList) myeonbulList = []
    res.send(createResponse(myeonbulList))
})

export default router
