import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { storyItem } from '../models/storyItem'
import { storyUpdate } from '../models/storyUpdate';
const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('Process story for dataLayer')

export class StorysAccess {

    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly storysTable = process.env.storyS_TABLE,
        private readonly bucketName = process.env.ATTACHMENT_S3_BUCKET,
        private readonly s3 = new XAWS.S3({
            signatureVersion: 'v4'
        }),
    ) {
    }

    async getAllstorysForUser(userId: string): Promise<storyItem[]> {
        const result = await this.docClient.query({
            TableName: this.storysTable,
            KeyConditionExpression: "userId = :userId",
            ExpressionAttributeValues: {
                ":userId": userId
            }
        }).promise()
        const items = result.Items
        return items as storyItem[]
    }

    async createstory(newItem: storyItem): Promise<storyItem> {
        await this.docClient.put({
            TableName: this.storysTable,
            Item: newItem
        }).promise()
        return newItem
    }

    async updateAttachmentUrl(userId: string, storyId: string, uploadUrl: string): Promise<string> {
        await this.docClient.update({
            TableName: this.storysTable,
            Key: {
                userId: userId,
                storyId: storyId
            },
            UpdateExpression: 'set attachmentUrl = :attachmentUrl',
            ExpressionAttributeValues: {
                ':attachmentUrl': uploadUrl.split("?")[0]
            }
        }).promise()
        logger.info('Result is: ' + uploadUrl);
        return uploadUrl
    }

    async updatestory(userId: string, storyId: string, storyUpdate: storyUpdate): Promise<storyUpdate> {
        await this.docClient.update({
            TableName: this.storysTable,
            Key: {
                userId: userId,
                storyId: storyId
            },
            UpdateExpression: 'set #dynobase_name = :name, dueDate = :dueDate, done = :done',
            ExpressionAttributeValues: {
                ':name': storyUpdate.name,
                ':dueDate': storyUpdate.dueDate,
                ':done': storyUpdate.done,
            },
            ExpressionAttributeNames: { "#dynobase_name": "name" }
        }).promise()
        return storyUpdate
    }

    async deletestory(userId: string, storyId: string) {
        this.docClient.delete({
            TableName: this.storysTable,
            Key: {
                storyId: storyId,
                userId: userId
            }
        })
         const params = {
            Bucket: this.bucketName,
            Key: storyId
        }
        await this.s3.deleteObject(params, function (err, data) {
            if (err) logger.info('Delete failure', err.stack)
            else logger.info(data)
        }).promise()
    }
}

function createDynamoDBClient(): DocumentClient {
    const service = new AWS.DynamoDB()
    const client = new AWS.DynamoDB.DocumentClient({
      service: service
    })
    AWSXRay.captureAWSClient(service)
    return client
  }