import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'

import { getUserId } from '../utils.mjs'
import { todoAccess, createTodo } from '../../businessLogic/todos.mjs'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('createTodo')

export const handler = middy()
  .use(httpErrorHandler())
  .use(cors({ credentials: true }))
  .handler(async (event) => {
    const newTodo = JSON.parse(event.body)
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

    logger.info('Creating new todo object')
    const resp = await createTodo(newTodo)

    return {
      statusCode: 201,
      body: JSON.stringify({
        item: resp
      })
    }
  })