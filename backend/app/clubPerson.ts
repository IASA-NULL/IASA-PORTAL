import express from 'express'
import { Club, Person } from '../../scheme/user'
import db from '../util/db'
import createResponse from '../createResponse'
import { uuid } from '../util/random'
import { DB_CONNECT_ERROR } from '../../string/error'

const router = express.Router()

async function getPerson(res: any) {
    const personDB = await db.direct('person', 'iasa_club')
    const personList = await personDB.find({}).sort('number', 1).toArray()
    res.send(createResponse(personList))
}

async function deletePerson(number: string, res: any) {
    const personInfo = (await db.get(
        'person',
        'number',
        number,
        'iasa_club'
    )) as Person
    if (!personInfo) {
        res.status(404)
        res.send(createResponse(false, '올바르지 않은 번호에요.'))
        return
    }
    await db.del('person', 'number', number, 'iasa_club')
    res.send(createResponse(true))
}

async function checkPerson(res: any) {
    const personDB = await db.direct('person', 'iasa_club')
    const personList = await personDB.find({}).toArray()
    res.send(createResponse(personList.length()))
}

async function addPerson(
    number: string,
    name: string,
    first1: string,
    first2: string,
    second1: string,
    second2: string,
    res: any
) {
    try {
        if (!number || !name || !first1 || !first2 || !second1 || !second2) {
            res.status(412)
            res.send(createResponse(false, '내용을 모두 채워주세요.'))
            return
        }
        if (first1 === '없음') {
            res.status(412)
            res.send(
                createResponse(false, '제1동아리 한 개 이상 신청해주세요.')
            )
            return
        }
        if (first1 === first2 || (second1 === second2 && second1 !== '없음')) {
            res.status(412)
            res.send(createResponse(false, '내용을 겹치지 않게 채워주세요.'))
            return
        }

        let register = (await db.get(
            'person',
            'number',
            number,
            'iasa_club'
        )) as Person | undefined
        if (register) {
            await db.update(
                'person',
                'number',
                number,
                {
                    first1: [first1, 0],
                    first2: [first2, 0],
                    second1: [second1, 0],
                    second2: [second2, 0],
                },
                'iasa_club'
            )
            res.send(createResponse(true, '수정했어요.'))
            return
        }

        await db.set(
            'person',
            {
                number: number,
                name: name,
                first1: [first1, 0],
                first2: [first2, 0],
                second1: [second1, 0],
                second2: [second2, 0],
            },
            'iasa_club'
        )
        res.send(createResponse(true))
    } catch (e) {
        res.send(false, DB_CONNECT_ERROR)
    }
}

async function personIn(number: string, res: any) {
    let personInfo = (await db.get('person', 'number', number, 'iasa_club')) as
        | Person
        | undefined
    if (!personInfo) {
        res.status(404)
        res.send(createResponse(false, '올바르지 않은 번호에요.'))
        return
    }
    res.send(createResponse(personInfo))
}

async function setPerson(req: any, res: any) {
    try {
        for (let i = 0; i < req.length; i++) {
            let register = (await db.get(
                'person',
                'number',
                req[i].number,
                'iasa_club'
            )) as Person | undefined
            if (register) {
                if (req[i].permission === '1') {
                    await db.update(
                        'person',
                        'number',
                        req[i].number,
                        {
                            first1: [register.first1[0], req[i].isPass[0]],
                            first2: [register.first2[0], req[i].isPass[1]],
                        },
                        'iasa_club'
                    )
                } else {
                    await db.update(
                        'person',
                        'number',
                        req[i].number,
                        {
                            second1: [register.second1[0], req[i].isPass[0]],
                            second2: [register.second2[0], req[i].isPass[1]],
                        },
                        'iasa_club'
                    )
                }
            }
        }
        res.send(createResponse(true, '수정했습니다.'))
    } catch (e) {
        res.send(false, DB_CONNECT_ERROR)
    }
}

router.get('/person', async (req, res) => {
    await getPerson(res)
})

router.post('/person', async (req, res) => {
    await addPerson(
        req.body.number,
        req.body.name,
        req.body.first1,
        req.body.first2,
        req.body.second1,
        req.body.second2,
        res
    )
})

router.delete('/person/:number', async (req, res) => {
    await deletePerson(req.params.number, res)
})

router.get('/checkPerson', async (req, res) => {
    await checkPerson(res)
})

router.post('/personInfo', async (req, res) => {
    await personIn(req.body.number, res)
})

router.post('/set', async (req, res) => {
    await setPerson(req.body.send, res)
})

export default router
