import express from 'express'

import createResponse from '../createResponse'
import { REQUIRE_PERMISSION_ERROR } from '../../string/error'
import { getNotifications } from '../util/notification'
import {
    Notifications,
    OneDayNotifications,
} from '../../scheme/api/notification'

const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const notificationList = (await getNotifications(
            req.auth.uid
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
        notifyList.push(thisDayNotify)
        res.send(createResponse(notifyList))
    } catch (e) {
        res.status(500)
        res.send(createResponse(false, REQUIRE_PERMISSION_ERROR))
    }
})

export default router
