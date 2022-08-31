import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getAllstorysForUser } from '../../bussiness/storys'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('get-story')

// story: Get all story items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const userId = getUserId(event)
      const storys = await getAllstorysForUser(userId)
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          items: storys
        })
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
handler.use(
  cors({
    credentials: true
  })
)
