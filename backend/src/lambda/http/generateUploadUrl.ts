import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { AttachmentUtils } from '../../datalayer/attachmentUtils'
import { updateAttachmentUrl } from '../../bussiness/storys'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
import { v4 as uuidv4 } from 'uuid'

const logger = createLogger('generateUpload-story')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const storyId = event.pathParameters.storyId
    const attachmentUtils = new AttachmentUtils()

    // story: Return a presigned URL to upload a file for a story item with the provided id
    const userId = getUserId(event)
    try {
      const attachmentId = uuidv4()
      let uploadUrl = await attachmentUtils.createAttachmentPresignedUrl(
        attachmentId
      )
      const attachmentUrl = await attachmentUtils.getAttachmentUrl(attachmentId)
      await updateAttachmentUrl(userId, storyId, attachmentUrl)
      return {
        statusCode: 201,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
          uploadUrl: uploadUrl
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
