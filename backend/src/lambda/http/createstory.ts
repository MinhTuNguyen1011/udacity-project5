import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreatestoryRequest } from '../../requests/CreatestoryRequest'
import { getUserId } from '../utils'
import { createstory } from '../../bussiness/storys'
import { createLogger } from '../../utils/logger'

const logger = createLogger('create-story-processing')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const newstory: CreatestoryRequest = JSON.parse(event.body)
      if (newstory.name.trim() == '') {
        return {
          statusCode: 400,
          body: 'Input story name value'
        }
      } else {
        const userId = getUserId(event)
        const item = await createstory(userId, newstory)
        return {
          statusCode: 201,
          headers: {
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({
            item
          })
        }
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
