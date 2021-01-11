import express from 'express'

import {Permission} from "../../scheme/api/auth"
import createResponse from "../createResponse"
import {MyeonbulRequestListType} from "../../scheme/api/myeonbul"
import db from "../util/db"

const router = express.Router()

router.use((req, res, next) => {
    if (!req.auth) {
        res.status(403)
        res.send(createResponse(false, "먼저 로그인하세요."))
    } else {
        next()
    }
})

router.post('/list', async (req, res, next) => {
    if (req.auth.permission === Permission.student) {
        if (req.body.type === MyeonbulRequestListType.listByDate) {
            res.status(403)
            res.send(createResponse(false, "권한이 없어요."))
        } else if (req.body.type === MyeonbulRequestListType.listByUser) {
            let myeonbulDB = await db.direct('myeonbul')
            if(!myeonbulDB) {

            }
            res.send(createResponse([
                {
                    timeRange: {
                        begin: 1608467311778,
                        end: 1608467411778,
                        nickname: '면학 1차시'
                    },
                    teacher: {
                        name: '가나다',
                        id: 2
                    },
                    place: '면학실',
                    approved: false
                },
                {
                    timeRange: {
                        begin: 1608467311778,
                        end: 1608467411778
                    },
                    teacher: {
                        name: '이서현',
                        id: 1
                    },
                    place: '면학실',
                    approved: true
                }, {
                    timeRange: {
                        begin: 1608467311778,
                        end: 1608467411778,
                        nickname: '면학 1차시'
                    },
                    teacher: {
                        name: '가나다',
                        id: 2
                    },
                    place: '면학실',
                    approved: false
                },
                {
                    timeRange: {
                        begin: 1608467311778,
                        end: 1608467411778
                    },
                    teacher: {
                        name: '이서현',
                        id: 1
                    },
                    place: '면학실',
                    approved: true
                }, {
                    timeRange: {
                        begin: 1608467311778,
                        end: 1608467411778,
                        nickname: '면학 1차시'
                    },
                    teacher: {
                        name: '가나다',
                        id: 2
                    },
                    place: '면학실',
                    approved: false
                },
                {
                    timeRange: {
                        begin: 1608467311778,
                        end: 1608467411778
                    },
                    teacher: {
                        name: '이서현',
                        id: 1
                    },
                    place: '면학실',
                    approved: true
                }, {
                    timeRange: {
                        begin: 1608467311778,
                        end: 1608467411778,
                        nickname: '면학 1차시'
                    },
                    teacher: {
                        name: '가나다',
                        id: 2
                    },
                    place: '면학실',
                    approved: false
                },
                {
                    timeRange: {
                        begin: 1608467311778,
                        end: 1608467411778
                    },
                    teacher: {
                        name: '이서현',
                        id: 1
                    },
                    place: '면학실',
                    approved: true
                }, {
                    timeRange: {
                        begin: 1608467311778,
                        end: 1608467411778,
                        nickname: '면학 1차시'
                    },
                    teacher: {
                        name: '가나다',
                        id: 2
                    },
                    place: '면학실',
                    approved: false
                },
                {
                    timeRange: {
                        begin: 1608467311778,
                        end: 1608467411778
                    },
                    teacher: {
                        name: '이서현',
                        id: 1
                    },
                    place: '면학실',
                    approved: true
                }, {
                    timeRange: {
                        begin: 1608467311778,
                        end: 1608467411778,
                        nickname: '면학 1차시'
                    },
                    teacher: {
                        name: '가나다',
                        id: 2
                    },
                    place: '면학실',
                    approved: false
                },
                {
                    timeRange: {
                        begin: 1608467311778,
                        end: 1608467411778
                    },
                    teacher: {
                        name: '이서현',
                        id: 1
                    },
                    place: '면학실',
                    approved: true
                }, {
                    timeRange: {
                        begin: 1608467311778,
                        end: 1608467411778,
                        nickname: '면학 1차시'
                    },
                    teacher: {
                        name: '가나다',
                        id: 2
                    },
                    place: '면학실',
                    approved: false
                },
                {
                    timeRange: {
                        begin: 1608467311778,
                        end: 1608467411778
                    },
                    teacher: {
                        name: '이서현',
                        id: 1
                    },
                    place: '면학실',
                    approved: true
                }, {
                    timeRange: {
                        begin: 1608467311778,
                        end: 1608467411778,
                        nickname: '면학 1차시'
                    },
                    teacher: {
                        name: '가나다',
                        id: 2
                    },
                    place: '면학실',
                    approved: false
                },
                {
                    timeRange: {
                        begin: 1608467311778,
                        end: 1608467411778
                    },
                    teacher: {
                        name: '이서현',
                        id: 1
                    },
                    place: '면학실',
                    approved: true
                }, {
                    timeRange: {
                        begin: 1608467311778,
                        end: 1608467411778,
                        nickname: '면학 1차시'
                    },
                    teacher: {
                        name: '가나다',
                        id: 2
                    },
                    place: '면학실',
                    approved: false
                },
                {
                    timeRange: {
                        begin: 1608467311778,
                        end: 1608467411778
                    },
                    teacher: {
                        name: '이서현',
                        id: 1
                    },
                    place: '면학실',
                    approved: true
                }, {
                    timeRange: {
                        begin: 1608467311778,
                        end: 1608467411778,
                        nickname: '면학 1차시'
                    },
                    teacher: {
                        name: '가나다',
                        id: 2
                    },
                    place: '면학실',
                    approved: false
                },
                {
                    timeRange: {
                        begin: 1608467311778,
                        end: 1608467411778
                    },
                    teacher: {
                        name: '이서현',
                        id: 1
                    },
                    place: '면학실',
                    approved: true
                }, {
                    timeRange: {
                        begin: 1608467311778,
                        end: 1608467411778,
                        nickname: '면학 1차시'
                    },
                    teacher: {
                        name: '가나다',
                        id: 2
                    },
                    place: '면학실',
                    approved: false
                },
                {
                    timeRange: {
                        begin: 1608467311778,
                        end: 1608467411778
                    },
                    teacher: {
                        name: '이서현',
                        id: 1
                    },
                    place: '면학실',
                    approved: true
                }, {
                    timeRange: {
                        begin: 1608467311778,
                        end: 1608467411778,
                        nickname: '면학 1차시'
                    },
                    teacher: {
                        name: '가나다',
                        id: 2
                    },
                    place: '면학실',
                    approved: false
                },
                {
                    timeRange: {
                        begin: 1608467311778,
                        end: 1608467411778
                    },
                    teacher: {
                        name: '이서현',
                        id: 1
                    },
                    place: '면학실',
                    approved: true
                }, {
                    timeRange: {
                        begin: 1608467311778,
                        end: 1608467411778,
                        nickname: '면학 1차시'
                    },
                    teacher: {
                        name: '가나다',
                        id: 2
                    },
                    place: '면학실',
                    approved: false
                },
                {
                    timeRange: {
                        begin: 1608467311778,
                        end: 1608467411778
                    },
                    teacher: {
                        name: '이서현',
                        id: 1
                    },
                    place: '면학실',
                    approved: true
                }, {
                    timeRange: {
                        begin: 1608467311778,
                        end: 1608467411778,
                        nickname: '면학 1차시'
                    },
                    teacher: {
                        name: '가나다',
                        id: 2
                    },
                    place: '면학실',
                    approved: false
                },
                {
                    timeRange: {
                        begin: 1608467311778,
                        end: 1608467411778
                    },
                    teacher: {
                        name: '이서현',
                        id: 1
                    },
                    place: '면학실',
                    approved: true
                }, {
                    timeRange: {
                        begin: 1608467311778,
                        end: 1608467411778,
                        nickname: '면학 1차시'
                    },
                    teacher: {
                        name: '가나다',
                        id: 2
                    },
                    place: '면학실',
                    approved: false
                },
                {
                    timeRange: {
                        begin: 1608467311778,
                        end: 1608467411778
                    },
                    teacher: {
                        name: '이서현',
                        id: 1
                    },
                    place: '면학실',
                    approved: true
                }, {
                    timeRange: {
                        begin: 1608467311778,
                        end: 1608467411778,
                        nickname: '면학 1차시'
                    },
                    teacher: {
                        name: '가나다',
                        id: 2
                    },
                    place: '면학실',
                    approved: false
                },
                {
                    timeRange: {
                        begin: 1608467311778,
                        end: 1608467411778
                    },
                    teacher: {
                        name: '이서현',
                        id: 1
                    },
                    place: '면학실',
                    approved: true
                }, {
                    timeRange: {
                        begin: 1608467311778,
                        end: 1608467411778,
                        nickname: '면학 1차시'
                    },
                    teacher: {
                        name: '가나다',
                        id: 2
                    },
                    place: '면학실',
                    approved: false
                },
                {
                    timeRange: {
                        begin: 1608467311778,
                        end: 1608467411778
                    },
                    teacher: {
                        name: '이서현',
                        id: 1
                    },
                    place: '면학실',
                    approved: true
                }, {
                    timeRange: {
                        begin: 1608467311778,
                        end: 1608467411778,
                        nickname: '면학 1차시'
                    },
                    teacher: {
                        name: '가나다',
                        id: 2
                    },
                    place: '면학실',
                    approved: false
                },
                {
                    timeRange: {
                        begin: 1608467311778,
                        end: 1608467411778
                    },
                    teacher: {
                        name: '이서현',
                        id: 1
                    },
                    place: '면학실',
                    approved: true
                },
            ]))
        } else {
            res.status(412)
            res.send(createResponse(false, "요청이 올바르지 않아요."))
        }
    }
})

export default router
