
import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'

import { getUserId } from '../utils.mjs'
import { genereatePresignedUrl } from '../../businessLogic/todos.mjs'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('lambdaGeneratePresignedURL')

export const handler = middy()
  .use(httpErrorHandler())
  .use(cors({ credentials: true }))
  .handler(async (event) => {
    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)

    logger.info('LAMDA: Generating presigned URL')
    const resp = await genereatePresignedUrl(userId, todoId)

    return {
      statusCode: 201,
      body: JSON.stringify({
        uploadUrl: resp
      })
    }
  })
