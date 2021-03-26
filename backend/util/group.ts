import db from './db'
import { uuid } from '../util/random'
import { User, UID } from '../../scheme/user'

export const UNIVERSAL_GROUP = '00000000-0000-0000-0000-000000000000'

export async function createGroup(name: string) {
    const gid = uuid()
    await db.set(
        '_meta',
        {
            gid: gid,
            name: name,
        },
        'iasa_portal_group'
    )
    return gid
}

export async function addToGroup(gid: string, uid: UID) {
    const user = (await db.get('account', 'uid', uid)) as User
    if (!user) return false
    if (gid in user.group) return true
    user.group.push(gid)
    await db.update('account', 'uid', uid, { group: user.group })
    return true
}
