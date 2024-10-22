
import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'

import { getUserId } from '../utils.mjs'
import { todoAccess, deleteTodo } from '../../businessLogic/todos.mjs'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('deleteTodo')

export const handler = middy()
  .use(httpErrorHandler())
  .use(cors({ credentials: true }))
  .handler(async (event) => {
    const todoId = event.pathParameters.todoId
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

    logger.info('Deleting todo object')
    await deleteTodo(todoId)

    return {
      statusCode: 204
    }
  })
