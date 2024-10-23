
import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'

import { getUserId } from '../utils.mjs'
import { getTodo } from '../../businessLogic/todos.mjs'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('lambdaGetTodo')

export const handler = middy()
  .use(httpErrorHandler())
  .use(cors({ credentials: true }))
  .handler(async (event) => {
    const userId = getUserId(event)
    
    logger.info('LAMDA: Get todo items from user id')
    const resp = await getTodo(userId)

    return {
      statusCode: 200,
      body: JSON.stringify({
        items: resp
      })
    }
  })
