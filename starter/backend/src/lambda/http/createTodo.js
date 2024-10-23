import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'

import { getUserId } from '../utils.mjs'
import { createTodo } from '../../businessLogic/todos.mjs'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('lambdaCreateTodo')

export const handler = middy()
  .use(httpErrorHandler())
  .use(cors({ credentials: true }))
  .handler(async (event) => {
    const newTodo = JSON.parse(event.body)
    const userId = getUserId(event)

    logger.info('LAMDA: Creating new todo object')
    const resp = await createTodo(userId, newTodo)

    return {
      statusCode: 201,
      body: JSON.stringify({
        item: resp
      })
    }
  })