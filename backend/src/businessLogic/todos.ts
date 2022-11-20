import { TodosAccess } from '../dataLayer/todosAcess'
import { AttachmentUtils } from '../helpers/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import { TodoUpdate } from '../models/TodoUpdate';
// import * as createError from 'http-errors'

// TODO: Implement businessLogic
const logger = createLogger('TodosAccess')
const attachmentUtils = new AttachmentUtils()
const todosAcess = new TodosAccess()

//get Todos function
export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
  logger.info('Get todos for user funciton called')
  return todosAcess.getAllTodos(userId)} 



// Create Todo Function
export async function createTodo(
  newTodo: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {
  logger.info('Create todo funciton called')

  const todoId = uuid.v4()
  const createdAt = new Date().toISOString()
  const s3AttachmentUrl = attachmentUtils.getAttachmentUrl(todoId)
  const newItem = {
    todoId,
    userId,
    createdAt,
    done: false,
    attachmentUrl:s3AttachmentUrl,
    ...newTodo
  }
  return await todosAcess.createTodoitem(newItem)
}

//update todo function

export async function updateTodo(
  todoId: string,
  todoUpdate: UpdateTodoRequest,
  userId: string
  ): Promise<TodoUpdate> {
  logger.info('update todos function called')
  return  todosAcess.updateTodoItem(todoId, todoUpdate, userId)} 

//delete todo function 

export async function deleteTodo(
  todoId: string,
  userId: string,
  ): Promise<string> {
  logger.info('Delete todos funciton called')
  return  todosAcess.deleteTodoItem(todoId, userId)} 

// upload url function
export async function createAttachmentPresignedUrl(
  todoId: string,
  userId: string
  ): Promise<string> {
  logger.info('Create attachment function called by', userId, todoId)
  return  attachmentUtils.getUploadUrl(todoId)} 