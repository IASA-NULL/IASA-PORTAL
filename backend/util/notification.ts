import db from './db'
import { v4 as uuid } from 'uuid'
import { NotificationOne } from '../../scheme/api/notification'

export async function createNotify(
    uidL: number[],
    title: string,
    subtitle: string,
    link: string,
    read = false,
    avatar?: string
) {
    const nidL = [] as string[]
    for (const uid of uidL) {
        const nid = uuid()
        await db.set('notifications', {
            uid: uid,
            title: title,
            subtitle: subtitle,
            link: link,
            avatar: avatar,
            time: Date.now(),
            nid: nid,
            read: read,
        })
        nidL.push(nid)
    }
    return nidL
}

export async function getNotifications(uid: number) {
    const notifyDB = await db.direct('notifications')
    return await notifyDB.find({ uid: uid }).sort('_id', -1).limit(40).toArray()
}

export async function removeNotification(nid: string, uid?: number) {
    if (uid) {
        const notify = (await db.get(
            'notifications',
            'nid',
            nid
        )) as NotificationOne
        if (!notify) return false
        if (notify.uid !== uid) return false
    }
    return await db.del('notifications', 'nid', nid)
}
