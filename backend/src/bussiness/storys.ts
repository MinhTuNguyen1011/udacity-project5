import { StorysAccess } from '../datalayer/storysAcess'
import { storyItem } from '../models/storyItem'
import { storyUpdate } from '../models/storyUpdate'
import { CreatestoryRequest } from '../requests/CreatestoryRequest'
import { UpdatestoryRequest } from '../requests/UpdatestoryRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'

const storysAccess = new StorysAccess()
const logger = createLogger('Processing for storys')

export async function getAllstorysForUser(userId: string): Promise<storyItem[]> {
    logger.info('Processing to get all storys items for user id ' + userId);
    return storysAccess.getAllstorysForUser(userId)
}
export async function createstory(userId: string, newstory: CreatestoryRequest): Promise<storyItem> {
  const storyId = uuid.v4()
  const createdAt = new Date().toISOString()  
  let newItem: storyItem = {
    userId,
    storyId,
    createdAt,
    done: false,
    ...newstory,
    attachmentUrl: ''
  }
  logger.info('Processing to create story item ' + newItem);
  return await storysAccess.createstory(newItem)
}
  
export async function updatestory(userId: string, storyId: string, updatedstory: UpdatestoryRequest): Promise<storyUpdate> {
  let storyUpdate: storyUpdate = {...updatedstory}
  logger.info('Processing to update story with user id ' + userId);
  return storysAccess.updatestory(userId, storyId, storyUpdate)
}

export async function updateAttachmentUrl(userId: string, storyId: string, attachmentUrl: string): Promise<string> {
  logger.info('Processing to update url for user id ' + userId);
  return storysAccess.updateAttachmentUrl(userId, storyId, attachmentUrl)
}

export async function deletestory(userId: string, storyId: string) {
  logger.info('Processing to delete story with user id ' + userId);
  return storysAccess.deletestory(userId, storyId)
    
}