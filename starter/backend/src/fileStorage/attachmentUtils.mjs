import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import AWSXRay from 'aws-xray-sdk-core'
import { createLogger } from "../utils/logger.mjs"

const logger = createLogger('filestorageTodoLogic')

const s3bucket = AWSXRay.captureAWSv3Client(new S3Client())

export class attachmentUtils{
    constructor(){
        this.s3Client = s3bucket;
        this.bucketName = process.env.TODO_S3_BUCKET;
        this.urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION);
    }

    async genereateS3PresignedUrl(todoId){
        // Reference https://aws.amazon.com/blogs/developer/generate-presigned-url-modular-aws-sdk-javascript/
        logger.info(`FILE STORAGE: Generate presigned url for todo id: ${todoId}`)
        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: todoId
        })
        
        return await getSignedUrl(this.s3Client, command, { expiresIn: this.urlExpiration })
    }
}