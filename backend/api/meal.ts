import {
    mealTime,
    MealResponse,
    AllergicInfo,
    mealTimeToString,
} from '../../scheme/api/meal'
import nodeFetch from 'node-fetch'

import db from '../util/db'
import { UID } from '../../scheme/user'
import createResponse from '../createResponse'
import express from 'express'
import { REQUIRE_PERMISSION_ERROR } from '../../string/error'
import _ from 'lodash'

const fetch = require('fetch-cookie')(nodeFetch)

function isHangul(ch: string) {
    let c = ch.charCodeAt(0)
    return 0xac00 <= c && c <= 0xd7a3
}

function getMeal(target: mealTime, uid: UID) {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.get('meal', 'time', mealTimeToString(target))
            if (data) {
                data.data.vote = await getMealVoteRes(target, uid)
                resolve({
                    success: true,
                    data: data,
                })
                return
            }
        } catch (e) {}

        let data
        try {
            data = {
                year: target.year.toString(),
                month: target.month.toString(),
                day: target.day.toString(),
                foodType: ['B', 'L', 'D'][target.type],
                deIm: '',
                sysId: 'isaa',
                menuId: '',
                path: '',
                type: ['breakfast', 'lunch', 'dinner'][target.type],
                selType: 'A',
            }
        } catch (e) {
            reject()
        }
        let formBody = []
        for (let property in data) {
            let encodedKey = encodeURIComponent(property)
            //@ts-ignore
            let encodedValue = encodeURIComponent(data[property])
            formBody.push(encodedKey + '=' + encodedValue)
        }
        let pres
        for (let i = 0; i < 3; i++) {
            let req = await fetch(
                `http://iasa.icehs.kr/isaa/food/${target.year}/${
                    target.month
                }/${target.day}/${
                    ['breakfast', 'lunch', 'dinner'][target.type]
                }.do`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type':
                            'application/x-www-form-urlencoded;charset=UTF-8',
                        'User-Agent':
                            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:65.0) Gecko/20100101 Firefox/65.0',
                        Host: 'iasa.icehs.kr',
                        Referer:
                            'http://iasa.icehs.kr/foodlist.do?m=040406&s=isaa',
                    },
                    body: formBody.join('&'),
                }
            )
            pres = await req.text()
            try {
                let menuList = pres
                    .split('<td')[2]
                    .split('<div>')[1]
                    .split('</div>')[0]
                    .trim()
                    .split('<br />')
                    .map((menuStr: string) => {
                        let start = -1,
                            end = 0
                        for (let i = 0; i < menuStr.length; i++) {
                            if (isHangul(menuStr[i])) {
                                if (start === -1) start = i
                                end = i
                            }
                        }
                        if (
                            menuStr[end + 1] === ')' ||
                            menuStr[end + 1] === ']' ||
                            menuStr[end + 1] === '>'
                        )
                            end++
                        let menuName = menuStr.substring(start, end + 1)
                        if (!menuName) return null
                        let allergicList
                        try {
                            allergicList = menuStr
                                .substring(end + 1)
                                .match(/\d+/g)
                                .map(Number)
                        } catch (e) {
                            allergicList = [] as AllergicInfo[]
                        }
                        return {
                            name: menuName,
                            allergicInfo: allergicList,
                        }
                    })
                    .filter((x: any) => x)

                let imageSrc = ''

                try {
                    imageSrc = pres.split('<img src="')[1].split('"')[0]
                } catch (e) {}

                let originList = [],
                    energyList = [],
                    kcal,
                    imageBase64,
                    allLoaded = false

                try {
                    kcal = parseFloat(
                        pres
                            .split('<td')[1]
                            .split('>')[1]
                            .split('</td>')[0]
                            .replace(/[^\d.]/g, '')
                    )
                } catch (e) {
                    kcal = 0
                }

                try {
                    originList = pres
                        .split('<td')[4]
                        .split('<div>')[1]
                        .split('</div>')[0]
                        .trim()
                        .split('<br />')
                        .map((originStr: string) => {
                            try {
                                return {
                                    name: originStr.split(':')[0].trim(),
                                    origin: originStr.split(':')[1].trim(),
                                }
                            } catch (e) {
                                return undefined
                            }
                        })
                        .filter((x: any) => x)
                } catch (e) {}

                try {
                    energyList = pres
                        .split('<td')[5]
                        .split('<div>')[1]
                        .split('</div>')[0]
                        .trim()
                        .split('<br />')
                        .map((originStr: string) => {
                            try {
                                return {
                                    name: originStr.split('(')[0].trim(),
                                    value: parseInt(
                                        originStr.split(':')[1].trim()
                                    ),
                                    unit: originStr
                                        .split('(')[1]
                                        .split(')')[0]
                                        .trim(),
                                }
                            } catch (e) {
                                return undefined
                            }
                        })
                        .filter((x: any) => x)
                } catch (e) {}

                try {
                    if (imageSrc) {
                        let res = await fetch('http://iasa.icehs.kr' + imageSrc)
                        let blob = await res.blob()
                        imageBase64 =
                            'data:' +
                            res.headers.get('Content-Type') +
                            ';base64,' +
                            new Buffer(await blob.arrayBuffer()).toString(
                                'base64'
                            )
                        allLoaded = true
                    }
                } catch (e) {}

                let res: MealResponse = createResponse({
                    menu: menuList,
                    image: imageBase64,
                    origin: originList,
                    energy: energyList,
                    kcal: kcal,
                })
                if (allLoaded) {
                    db.set('meal', {
                        ...res.data,
                        time: mealTimeToString(target),
                    }).catch()
                }
                res.data.vote = await getMealVoteRes(target, uid)
                resolve(res)
                return
            } catch (e) {
                //console.log(e)
            }
            await fetch('http://iasa.icehs.kr/')
            await fetch('http://iasa.icehs.kr/foodlist.do?m=040406&s=isaa')
        }
        resolve(createResponse(false, '급식 정보가 없어요.'))
    })
}

async function getMealVote(target: mealTime) {
    let info = await db.get('meal_vote', 'time', mealTimeToString(target))
    if (!info) {
        await db.set('meal_vote', {
            score: 0,
            voteList: [] as { uid: UID; score: number }[],
            time: mealTimeToString(target),
        })
        info = {
            score: 0,
            voteList: [] as { uid: UID; score: number }[],
            time: mealTimeToString(target),
        }
    }
    return info
}

async function getMealVoteRes(target: mealTime, uid: number) {
    const info = await getMealVote(target)
    return {
        score: info.voteList.length ? info.score / info.voteList.length : 0,
        me: _.find(info.voteList, { uid: uid })?.score ?? 0,
        count: info.voteList.length,
    }
}

async function voteMeal(target: mealTime, score: number, uid: UID) {
    let info = await db.get('meal_vote', 'time', mealTimeToString(target))
    if (!info) {
        await db.set('meal_vote', {
            score: 0,
            voteList: [] as { uid: UID; score: number }[],
            time: mealTimeToString(target),
        })
        info = {
            score: 0,
            voteList: [] as { uid: UID; score: number }[],
            time: mealTimeToString(target),
        }
    }
    const already = _.find(info.voteList, { uid: uid })
    if (already) {
        info.score -= already.score
        _.remove(info.voteList, { uid: uid })
    }
    if (score) {
        info.score += score
        info.voteList.push({
            uid: uid,
            score: score,
        })
    }
    await db.update('meal_vote', 'time', mealTimeToString(target), info)
    return
}

const router = express.Router()

router.post('/', (req, res) => {
    getMeal(req.body, req.auth.uid)
        .then(async (mealData: MealResponse) => {
            if (!mealData.success) res.status(404)
            res.send({
                ...mealData,
            })
        })
        .catch(() => {
            res.status(500)
            res.send(createResponse(false, '급식 정보를 불러올 수 없어요.'))
        })
})

router.post('/vote', async (req, res) => {
    if (!req.auth) {
        res.send(createResponse(false, REQUIRE_PERMISSION_ERROR))
        return
    }

    await voteMeal(
        {
            type: req.body.type,
            year: req.body.year,
            month: req.body.month,
            day: req.body.day,
        },
        req.body.score,
        req.auth.uid
    )
    res.send(createResponse(true))
})

export default router
