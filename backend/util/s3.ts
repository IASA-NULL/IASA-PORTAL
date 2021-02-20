import * as AWS from 'aws-sdk'
import { v4 as uuid } from 'uuid'
import { body } from 'express-validator'
import { DeleteObjectOutput, DeleteObjectRequest } from 'aws-sdk/clients/s3'

const s3Client = new AWS.S3({
    region: 'ap-northeast-2',
})

export function fileList(path: string, bucket = 'upload') {
    return new Promise<AWS.S3.ListObjectsOutput>((resolve, reject) => {
        s3Client.listObjects(
            {
                Bucket: bucket + '.iasa.kr',
                Prefix: path,
            },
            (err: any, res: any) => {
                resolve(res)
            }
        )
    })
}

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

export function downloadAsStream(id: string, bucket = 'upload') {
    return s3Client
        .getObject({
            Bucket: bucket + '.iasa.kr',
            Key: id,
        })
        .createReadStream()
}

export function remove(id: string, bucket = 'upload') {
    return new Promise<boolean>((resolve, reject) => {
        s3Client.deleteObject(
            {
                Bucket: bucket + '.iasa.kr',
                Key: id,
            },
            (err: any) => {
                if (err) {
                    reject()
                }
                resolve(true)
            }
        )
    })
}
