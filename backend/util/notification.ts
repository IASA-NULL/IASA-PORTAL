import db from './db'
import { uuid } from '../util/random'
import { NotificationOne } from '../../scheme/api/notification'
import { UID } from '../../scheme/user'

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
        const user = await db.get('account', 'uid', uid)
        if (!user) continue
        await db.update('account', 'uid', uid, {
            unreadNotifications: (user.unreadNotifications ?? 0) + 1,
        })
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

export async function getNotifications(uid: UID, read = false) {
    if (read) await db.update('account', 'uid', uid, { unreadNotifications: 0 })
    const notifyDB = await db.direct('notifications')
    return await notifyDB.find({ uid: uid }).sort('_id', -1).limit(40).toArray()
}

export async function removeNotification(nid: string, uid?: UID) {
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
