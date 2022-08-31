import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updatestory } from '../../bussiness/storys'
import { UpdatestoryRequest } from '../../requests/UpdatestoryRequest'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('update-story')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const storyId = event.pathParameters.storyId
    try {
      const updatedstory: UpdatestoryRequest = JSON.parse(event.body)
      // story: Update a story item with the provided id using values in the "updatedstory" object
      const userId = getUserId(event)
      const resultItem = await updatestory(userId, storyId, updatedstory)
      if (resultItem.name.trim() == '') {
        return {
          statusCode: 400,
          body: 'Input story name value'
        }
      }
      return {
        statusCode: 201,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          resultItem
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
handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
