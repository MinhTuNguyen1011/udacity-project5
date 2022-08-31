import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { deletestory } from '../../bussiness/storys'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
const logger = createLogger('delete-story')
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const storyId = event.pathParameters.storyId
    // story: Remove a story item by id
    try {
      const userId = getUserId(event)
      await deletestory(userId, storyId)
      return {
        statusCode: 201,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify(true)
      }
    } catch (e) {
      logger.error(e.message)
      return {
        statusCode: 500,
        body: e.message
      }
    }
  }
)
handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
