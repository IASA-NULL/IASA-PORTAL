import * as MongoDB from 'mongodb'
import getSecret from './secret'

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
            )}@localhost:27017/?authSource=admin&readPreference=primary&appname=portal&ssl=false`,
            (err, _db) => {
                if (err) {
                    reject()
                    return
                }
                db = _db
                resolve(db)
            }
        )
    })
}

async function get(collection: string, key: string, value: any) {
    let db
    try {
        db = await get_db()
        return await db
            .db('iasa_portal')
            .collection(collection)
            .findOne({ [key]: value })
    } catch (e) {
        console.log(e)
        return undefined
    }
}

async function set(collection: string, data: any) {
    let db
    try {
        db = await get_db()
        db.db('iasa_portal').collection(collection).insert({ data })
        return true
    } catch (e) {
        return false
    }
}

async function update(
    collection: string,
    key: string,
    value: string,
    data: any
) {
    let db
    try {
        db = await get_db()
        db.db('iasa_portal')
            .collection(collection)
            .updateOne({ [key]: value }, { $set: data }, { upsert: true })
        return true
    } catch (e) {
        return false
    }
}

async function directDB(collection: string) {
    try {
        db = await get_db()
        return db.db('iasa_portal').collection(collection)
    } catch (e) {
        return false
    }
}

export default {
    get: get,
    set: set,
    update: update,
    direct: directDB,
}
