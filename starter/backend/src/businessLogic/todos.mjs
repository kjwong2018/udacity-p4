
import * as uuid from 'uuid'
import { todoAccess } from '../dataLayer/todosAccess.mjs'
import { attachmentUtils } from '../fileStorage/attachmentUtils.mjs'
import { createLogger } from '../utils/logger.mjs'

const logger = createLogger('businessTodoLogic')

const todoA = new todoAccess()
const attachmentU = new attachmentUtils()

// Block for get, create, delete and update
export async function getTodo(userId) {
    logger.info(`BUSINESS LOGIC: Get all todo for user ${userId}`)
    return await todoA.getTodoByUserId(userId)
}

export async function createTodo(userId, newTodo) {
    logger.info(`BUSINESS LOGIC: Create todo item for user ${userId}`)

    const todoId = uuid.v4()
    const createdAt = new Date().toISOString()
    // Empty attachment url for initial create
    const attachmentUrl = ""

    const todoObj = {
        todoId,
        userId,
        createdAt,
        attachmentUrl: attachmentUrl,
        done: false,
        ...newTodo
    }

    return await todoA.createTodoObj(userId, todoObj)
}

export async function deleteTodo(userId, todoId) {
    logger.info(`BUSINESS LOGIC: Delete todo object: ${todoId} for user ${userId}`)
    await todoA.deleteTodoObj(userId, todoId)
}

export async function updateTodo(userId, todoId, updatedTodo) {
    logger.info(`BUSINESS LOGIC: Update todo object: ${todoId} for user ${userId}`)
    await todoA.updateTodoObj(userId, todoId, updatedTodo)
}

// Generate presigned url for attachement upload
export async function genereatePresignedUrl(userId, todoId) {
    logger.info(`BUSINESS LOGIC: Generate presigned url for object: ${todoId}`)
    const presignedUrl = await attachmentU.genereateS3PresignedUrl(todoId)
    
    const bucket = process.env.TODO_S3_BUCKET
    const attchmentUrl = {
        attachmentUrl: `https://${bucket}.s3.us-east-1.amazonaws.com/${todoId}`
    }

    logger.info(`BUSINESS LOGIC: Update presigned url for ${todoId} for user ${userId}`)
    await todoA.updateTodoObj(userId, todoId, attchmentUrl)

    return presignedUrl
}