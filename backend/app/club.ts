import express from 'express'
import { Club, Person } from '../../scheme/user'
import db from '../util/db'
import createResponse from '../createResponse'
import { uuid } from '../util/random'
import { DB_CONNECT_ERROR } from '../../string/error'
import { setUncaughtExceptionCaptureCallback } from 'process'

const router = express.Router()

async function getClub(res: any) {
    const clubDB = await db.direct('club', 'iasa_portal')
    const clubList = await clubDB.find({}).sort('permission', 1).toArray()
    res.send(createResponse(clubList))
}

async function addClub(permission: string, name: string, res: any) {
    try {
        if (!permission || !name) {
            res.status(412)
            res.send(createResponse(false, '내용을 모두 채워주세요.'))
            return
        }

        let register = (await db.get('club', 'name', name, 'iasa_portal')) as
            | Club
            | undefined
        if (register) {
            res.status(404)
            res.send(createResponse(false, '이미 존재해요.'))
            return
        }

        await db.set(
            'club',
            {
                permission: permission,
                name: name,
                uid: uuid().split('-')[0],
            },
            'iasa_portal'
        )
        res.send(createResponse(true))
    } catch (e) {
        res.send(false, DB_CONNECT_ERROR)
    }
}

async function deleteClub(uid: string, res: any) {
    const clubInfo = (await db.get('club', 'uid', uid, 'iasa_portal')) as Club
    if (!clubInfo) {
        res.status(404)
        res.send(createResponse(false, '올바르지 않은 동아리 ID에요.'))
        return
    }
    await db.del('club', 'uid', uid, 'iasa_portal')
    res.send(createResponse(true))
}

async function cutClub(res: any) {
    const clubDB = await db.direct('club', 'iasa_portal')
    const clubList = await clubDB.find({}).sort('permission', 1).toArray()
    res.send(createResponse(clubList))
}

async function pickClub(name: string, uid: string, res: any) {
    let clubInfo = (await db.get('club', 'name', name, 'iasa_portal')) as
        | Club
        | undefined

    if (!clubInfo) {
        res.send(false, '없는 동아리 입니다.')
        return
    }

    if (clubInfo.uid !== uid) {
        res.send(false, '비밀번호가 일치하지 않습니다.')
        return
    }

    res.send(createResponse(clubInfo))
}

async function setClub(req: Club, res: any) {
    const clubInfo = (await db.get(
        'club',
        'name',
        req.name,
        'iasa_portal'
    )) as Club
    if (!clubInfo) {
        res.status(404)
        res.send(createResponse(false, '올바르지 않은 동아리 ID에요.'))
        return
    }
    await db.update(
        'club',
        'name',
        req.name,
        {
            subject: req.subject,
            introduce: req.introduce,
            interview: req.interview,
            interviewTime: req.interviewTime,
            coverLetter: req.coverLetter,
            maxStudent: req.maxStudent,
            url: req.url,
            backgroundColor1: req.backgroundColor1,
            backgroundColor2: req.backgroundColor2,
            backgroundColor3: req.backgroundColor3,
        },
        'iasa_portal'
    )
    res.send(createResponse(true))
}

router.get('/', async (req, res) => {
    await getClub(res)
})

router.post('/', async (req, res) => {
    await addClub(req.body.permission, req.body.name, res)
})

router.post('/clubInfo', async (req, res) => {
    await pickClub(req.body.name, req.body.uid, res)
})

router.delete('/:uid', async (req, res) => {
    await deleteClub(req.params.uid, res)
})

router.get('/cut', async (req, res) => {
    await cutClub(res)
})

router.post('/set', async (req, res) => {
    await setClub(req.body.data, res)
})

export default router
