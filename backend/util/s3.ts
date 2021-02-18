import * as AWS from 'aws-sdk'
import { v4 as uuid } from 'uuid'

const s3Client = new AWS.S3({
    region: 'ap-northeast-2',
})

export function upload(body: any, bucket = 'upload') {
    const fileName = uuid()
    return new Promise<string>((resolve, reject) => {
        s3Client.upload(
            {
                Bucket: bucket + '.iasa.kr',
                Key: fileName,
                Body: body,
            },
            (err: any) => {
                if (err) {
                    reject()
                }
                resolve(fileName)
            }
        )
    })
}

export function download(id: string, bucket = 'upload') {
    return s3Client
        .getObject({
            Bucket: bucket + '.iasa.kr',
            Key: id,
        })
        .createReadStream()
}
