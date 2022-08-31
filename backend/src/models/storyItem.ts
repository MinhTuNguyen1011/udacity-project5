export interface storyItem {
  userId: string
  storyId: string
  createdAt: string
  name: string
  dueDate: string
  done: boolean
  attachmentUrl?: string
}
