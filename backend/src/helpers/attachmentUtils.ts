import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

// TODO: Implement the fileStogare logic
const s3BucketName = process.env.ATTACHMENT_S3_BUCKET
const urlExpiration = 300
// Debugoh changed the url exipration from  process.env.SIGNED_URL_EXPIRATION to 300

export class AttachmentUtils{
  constructor(
    private readonly s3 = new XAWS.S3({ signatureVersion: 'v4' }),
    private readonly bucketName = s3BucketName
  ){}

  getAttachmentUrl(todoId: string){
    return `https://${this.bucketName}.s3.amazonaws.com/${todoId}`
  }

  getUploadUrl(todoId: string): string {
    console.log('getuploadurl called')
    const url = this.s3.getSignedUrl('putObject', {
      Bucket: this.bucketName,
      Key: todoId,
      Expires: urlExpiration
    })
    return url as string
  }
}


// private readonly todosTable = process.env.TODOS_TABLE,  
//     private readonly docClient = new XAWS.DynamoDB.DocumentClient(),
//     private readonly indexName = process.env.INDEX_NAME