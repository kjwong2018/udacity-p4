
import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'

import { getUserId } from '../utils.mjs'
import { todoAccess, getTodo } from '../../businessLogic/todos.mjs'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('getTodo')

export const handler = middy()
  .use(httpErrorHandler())
  .use(cors({ credentials: true }))
  .handler(async (event) => {
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

    logger.info('Get todo items from user id')
    const resp = await getTodo(userId)

    return {
      statusCode: 200,
      body: JSON.stringify({
        items: resp
      })
    }
  })
