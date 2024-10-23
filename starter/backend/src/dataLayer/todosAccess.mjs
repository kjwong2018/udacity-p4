import AWSXRay from 'aws-xray-sdk'
import AWS from 'aws-sdk'
import { createLogger } from '../utils/logger.mjs'

const logger = createLogger('dataLayerTodoLogic')

// Create DB instance and client connection
// Cannot use Udacity's tutorial example if I need promise, reference from ChatGPT
const awsService = AWSXRay.captureAWS(AWS)
const dynamoDbClient = new awsService.DynamoDB.DocumentClient()

export class todoAccess {
    constructor(){
        this.dbClient = dynamoDbClient
        this.todoTable = process.env.TODO_TABLE
        this.tableIndex = process.env.TODO_CREATED_AT_INDEX
    }

    // Get list of todo items by user id
    async getTodoByUserId(userId){
        logger.info(`DATA_LAYER: Query todo items for user ${userId}`)
        const queryResp = await this.dbClient.query({
            TableName: this.todoTable,
            IndexName: this.tableIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise();
        return queryResp.Items
    }

    async createTodoObj(userId,todoObj){
        logger.info(`DATA_LAYER: Put todoObj for user ${userId}`)
        await this.dbClient.put({
            TableName: this.todoTable,
            Item: todoObj
        }).promise();

        return todoObj
    }

    async deleteTodoObj(userId, todoId){
        logger.info(`DATA_LAYER: Delete database todoObj for user ${userId}`)
        await this.dbClient.delete({
            TableName: this.todoTable,
            Key: { userId, todoId }
        }).promise();
    }

    async updateTodoObj(userId, todoId, updatedTodo){
        if (Object.keys(updatedTodo).length === 1 && "attachmentUrl" in updatedTodo){
            logger.info(`DATA_LAYER: Update attachment url for user ${userId} with todo id ${todoId}`)
            await this.dbClient.update({
                TableName: this.todoTable,
                Key: { userId, todoId },
                UpdateExpression: 'set #attachmentUrl = :attachmentUrl',
                ExpressionAttributeNames: { '#attachmentUrl': 'attachmentUrl' },
                ExpressionAttributeValues: { ':attachmentUrl': updatedTodo.attachmentUrl }
            }).promise();
            return;
        }

        logger.info(`DATA_LAYER: Update database todoObj for user ${userId} with todo id ${todoId}`)
        await this.dbClient.update({
            TableName: this.todoTable,
            Key: { userId, todoId },
            UpdateExpression: 'set #name = :name, #dueDate = :dueDate, #done = :done',
            ExpressionAttributeNames: {
                '#name': 'name',
                '#dueDate': 'dueDate',
                '#done': 'done',
              },
            ExpressionAttributeValues: {
                ':name': updatedTodo.name,
                ':dueDate': updatedTodo.dueDate,
                ':done': updatedTodo.done,
            }
        }).promise();
    }
}