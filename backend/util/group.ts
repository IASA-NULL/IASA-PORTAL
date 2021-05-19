import db from './db'
import { uuid } from '../util/random'
import { User, UID } from '../../scheme/user'
import { Group, GID, Kind } from '../../scheme/group'

export const UNIVERSAL_GROUP = '00000000-0000-0000-0000-000000000000'

//그룹생성
export async function createGroup(kind: Kind, name: string) {
    const gid = uuid()
    await db.set(
        '_meta',
        {
            gid: gid,
            kind: kind,
            name: name,
        },
        'iasa_portal_group'
    )
    return gid
}

//그룹제거
export async function deleteGroup(gid: GID) {
    const group = (await db.get('_meta', 'gid', gid)) as Group
    for (let n = 0; n < group.user.length; n++) {
        let uid = group.user[n]
        const user = (await db.get('account', 'uid', uid)) as User
        if (gid in user.group) {
            const idx = user.group.indexOf(gid)
            user.group.splice(idx, 1)
        }
        await db.update('account', 'uid', uid, { group: user.group })
    }

    await db.del('_meta', 'gid', gid, 'iasa_portal_group')
    return true
}

//그룹에 추가
export async function addToGroup(gid: GID, uid: UID) {
    const user = (await db.get('account', 'uid', uid)) as User
    const group = (await db.get('_meta', 'gid', gid)) as Group

    if (!user || !group) return false
    if (!(gid in user.group)) user.group.push(gid)
    if (!(uid in group.user)) group.user.push(uid)

    await db.update('account', 'uid', uid, { group: user.group })
    await db.update('_meta', 'gid', gid, { user: group.user })
    return true
}

//그룹에서 제거
export async function deleteToGroup(gid: string, uid: UID) {
    const user = (await db.get('account', 'uid', uid)) as User
    const group = (await db.get('_meta', 'gid', gid)) as Group

    if (!user || !group) return false
    if (gid in user.group) {
        const idx = user.group.indexOf(gid)
        user.group.splice(idx, 1)
    }
    if (uid in group.user) {
        const udx = group.user.indexOf(uid)
        group.user.splice(udx, 1)
    }

    await db.update('account', 'uid', uid, { group: user.group })
    await db.update('_meta', 'gid', gid, { user: group.user })
    return true
}
