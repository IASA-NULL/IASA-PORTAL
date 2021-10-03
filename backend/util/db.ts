import * as MongoDB from 'mongodb'
import getSecret from './secret'

declare const DEV_MODE: boolean
let db: any

function get_db() {
    return new Promise<any>((resolve, reject) => {
        if (db) {
            resolve(db)
            return
        }
        MongoDB.MongoClient.connect(
            `mongodb://portal:${getSecret(
                'db'
            )}@127.0.0.1:27017/?authSource=admin&readPreference=primary&appname=portal&ssl=false`,
            { useUnifiedTopology: true },
            (err, _db) => {
                db = _db
                resolve(db)
            }
        )
    })
}

async function get(
    collection: string,
    key: string,
    value: any,
    sub = 'iasa_portal'
) {
    if (!key || !value) return undefined
    let db
    try {
        db = await get_db()
        return await db
            .db(sub)
            .collection(collection)
            .findOne({ [key]: value })
    } catch (e) {
        console.log(e)
        return undefined
    }
}

async function del(
    collection: string,
    key: string,
    value: any,
    sub = 'iasa_portal'
) {
    if (!key || !value) return undefined
    let db
    try {
        db = await get_db()
        return await db
            .db(sub)
            .collection(collection)
            .deleteOne({ [key]: value })
    } catch (e) {
        console.log(e)
        return undefined
    }
}

async function set(collection: string, data: any, sub = 'iasa_portal') {
    let db
    try {
        db = await get_db()
        db.db(sub).collection(collection).insertOne(data)
        return true
    } catch (e) {
        return false
    }
}

async function update(
    collection: string,
    key: string,
    value: any,
    data: any,
    sub = 'iasa_portal'
) {
    if (!key || !value) return false
    let db
    try {
        db = await get_db()
        let original = get(collection, key, value)
        db.db(sub)
            .collection(collection)
            .updateOne(
                { [key]: value },
                { $set: Object.assign(original, data) },
                { upsert: true }
            )
        return true
    } catch (e) {
        return false
    }
}

async function directDB(collection: string, sub = 'iasa_portal') {
    try {
        db = await get_db()
        return db.db(sub).collection(collection)
    } catch (e) {
        return false
    }
}

const dbObject = {
    get: get,
    set: set,
    del: del,
    update: update,
    direct: directDB,
}

export default dbObject
