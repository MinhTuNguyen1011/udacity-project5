import { apiEndpoint } from '../config'
import { story } from '../types/story';
import { CreatestoryRequest } from '../types/CreatestoryRequest';
import Axios from 'axios'
import { UpdatestoryRequest } from '../types/UpdatestoryRequest';

export async function getstorys(idToken: string): Promise<story[]> {
  console.log('Fetching storys')

  const response = await Axios.get(`${apiEndpoint}/storys`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('storys:', response.data)
  return response.data.items
}

export async function createstory(
  idToken: string,
  newstory: CreatestoryRequest
): Promise<story> {
  const response = await Axios.post(`${apiEndpoint}/storys`,  JSON.stringify(newstory), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchstory(
  idToken: string,
  storyId: string,
  updatedstory: UpdatestoryRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/storys/${storyId}`, JSON.stringify(updatedstory), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deletestory(
  idToken: string,
  storyId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/storys/${storyId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  storyId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/storys/${storyId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
