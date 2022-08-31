/**
 * Fields in a request to update a single story item.
 */
export interface UpdatestoryRequest {
  name: string
  dueDate: string
  done: boolean
}