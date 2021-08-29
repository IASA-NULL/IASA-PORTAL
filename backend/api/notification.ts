import express from 'express'

import createResponse from '../createResponse'
import { DB_CONNECT_ERROR, REQUIRE_PERMISSION_ERROR } from '../../string/error'
import { getNotifications, removeNotification } from '../util/notification'
import {
    Notifications,
    OneDayNotifications,
} from '../../scheme/api/notification'
import db from '../util/db'
import { User } from '../../scheme/user'

const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const notificationList = (await getNotifications(
            req.auth.uid,
            true
        )) as Notifications
        let lastDate = new Date(0)
        let notifyList = [] as OneDayNotifications[],
            thisDayNotify = {
                date: lastDate.getTime(),
                notifications: [] as Notifications,
            } as OneDayNotifications
        for (let notify of notificationList) {
            let thisDate = new Date(notify.time)
            if (
                lastDate.getFullYear() !== thisDate.getFullYear() ||
                lastDate.getMonth() !== thisDate.getMonth() ||
                lastDate.getDate() !== thisDate.getDate()
            ) {
                if (thisDayNotify.notifications.length)
                    notifyList.push(thisDayNotify)
                thisDayNotify = {
                    date: thisDate.getTime(),
                    notifications: [] as Notifications,
                }
            }
            thisDayNotify.notifications.push(notify)
            lastDate = thisDate
        }
        if (thisDayNotify.notifications.length) notifyList.push(thisDayNotify)
        res.send(createResponse(notifyList))
    } catch (e) {
        res.status(500)
        res.send(createResponse(false, REQUIRE_PERMISSION_ERROR))
    }
})

router.delete('/', async (req, res) => {
    try {
        const notificationList = (await getNotifications(
            req.auth.uid,
            true
        )) as Notifications
        for (let i of notificationList) {
            await removeNotification(i.nid)
        }
        res.send(createResponse(true))
    } catch (e) {
        res.status(500)
        res.send(createResponse(false, DB_CONNECT_ERROR))
    }
})

router.get('/count', async (req, res) => {
    try {
        const user = (await db.get('account', 'uid', req.auth.uid)) as User
        res.send(createResponse({ count: user.unreadNotifications }))
    } catch (e) {
        res.status(500)
        res.send(createResponse(DB_CONNECT_ERROR))
    }
})

router.delete('/:nid', async (req, res) => {
    res.send(createResponse(removeNotification(req.params.nid, req.auth.uid)))
})

export default router
