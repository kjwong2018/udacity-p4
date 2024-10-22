import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'

import { getUserId } from '../utils.mjs'
import { todoAccess, updateTodo } from '../../businessLogic/todos.mjs'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('updateTodo')

export const handler = middy()
  .use(httpErrorHandler())
  .use(cors({ credentials: true }))
  .handler(async (event) => {
    const todoId = event.pathParameters.todoId
    const updatedTodo = JSON.parse(event.body)
    const userId = getUserId(event)

    logger.info('Validate userId todo access')
    const validAccess = await todoAccess(userId)

    if (!validAccess) {
      throw createError(
        403,
        JSON.stringify({
          error: 'User is forbidden'
        })
      )
    }

    logger.info('update todo item with todo id and event body')
    await updateTodo(todoId, updatedTodo)

    return {
      statusCode: 204
    }
  })