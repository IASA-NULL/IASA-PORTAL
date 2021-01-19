import {
    mealTime,
    MealResponse,
    AllergicInfo,
    mealTimeToString,
} from '../../scheme/api/meal'
import nodeFetch from 'node-fetch'

import db from '../util/db'
import createResponse from '../createResponse'
import express from 'express'

const fetch = require('fetch-cookie')(nodeFetch)

function isHangul(ch: string) {
    let c = ch.charCodeAt(0)
    return 0xac00 <= c && c <= 0xd7a3
}

function getMeal(target: mealTime) {
    return new Promise(async (resolve, reject) => {
        try {
            if (await db.get('meal', 'time', mealTimeToString(target))) {
                resolve({
                    success: true,
                    data: await db.get(
                        'meal',
                        'time',
                        mealTimeToString(target)
                    ),
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
                            menuStr[end + 1] == ')' ||
                            menuStr[end + 1] == ']' ||
                            menuStr[end + 1] == '>'
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
                            .replace(/[^\d\.]/g, '')
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
                            } catch (e) {}
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
                            } catch (e) {}
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

const router = express.Router()

router.post('/', (req, res, next) => {
    getMeal(req.body)
        .then((mealData: MealResponse) => {
            if (!mealData.success) res.status(404)
            res.send(mealData)
        })
        .catch((e) => {
            res.status(500)
            res.send(createResponse(false, '급식 정보를 불러올 수 없어요.'))
        })
})

export default router
