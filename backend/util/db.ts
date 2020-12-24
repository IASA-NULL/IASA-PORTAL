import * as MongoDB from 'mongodb'

let db: any

function get_db() {
    return new Promise<any>((resolve) => {
        if (db) {
            resolve(db)
            return
        }
        MongoDB.MongoClient.connect('mongodb://user:iasa2020!@localhost', (err, _db) => {
            db = _db
            resolve(db)
        })
    })
}

async function get(collection: string, key: string) {
    let db = await get_db()
    return (await db.db('iasa_portal').collection(collection).findOne({id: key}))?.value
}

async function set(collection: string, key: string, value: any) {
    let db = await get_db()
    db.db('iasa_portal').collection(collection).insert({
        id: key,
        value: value
    })
    return true
}

export default {
    get: get,
    set: set
}
