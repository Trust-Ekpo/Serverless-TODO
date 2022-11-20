import * as AWS from 'aws-sdk'
// import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';
var AWSXRay = require('aws-xray-sdk');
// import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic 
export class TodosAccess {
  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly todosTable = process.env.TODOS_TABLE,  
    private readonly todosIndex = process.env.INDEX_NAME
  ){}

  async getAllTodos(userId: string): Promise<TodoItem[]> {
    logger.info('Get all todos function called')

    const result = await this.docClient
    .query({
      TableName: this.todosTable,
      IndexName: this.todosIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      } 
    })
    .promise()

    const items = result.Items 
    return items as TodoItem[]
  }

  async createTodoitem(todoItem: TodoItem): Promise<TodoItem> {
    logger.info('Create todo item function called')

    const result = await this.docClient
    .put({
      TableName: this.todosTable,
      Item: todoItem
    })
    .promise()
    logger.info('Todo item created', result)

    // const todoItem = result.Items 
    return todoItem as TodoItem
  }

  async updateTodoItem(
    todoId: string, 
    todoUpdate: TodoUpdate,
    userId: string,

  ): Promise<TodoUpdate>{
    logger.info('update todo  function called')

    const result = await this.docClient
    .update({
      TableName: this.todosTable,
      Key: {
        todoId,
        userId
      },
      UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done', 
      ExpressionAttributeValues: {
        ':name': todoUpdate.name,
        ':dueDate': todoUpdate.dueDate,
        ':done': todoUpdate.done
      },
      ExpressionAttributeNames: {
        '#name': 'name'
      },
      ReturnValues: 'ALL_NEW'

    })
    .promise()
    const todoItemUpdate = result.Attributes 
    logger.info('Todo item as been updated', todoItemUpdate)
    return todoItemUpdate as TodoUpdate


  }


  async deleteTodoItem(
    todoId: string, 
    userId: string
  ): Promise<string>{
    logger.info('delete todo  function called')

    const result = await this.docClient
    .delete({
      TableName: this.todosTable,
      Key: {
        todoId,
        userId
      },
     

    })
    .promise()
    logger.info('Todo item as been deleted', result)
    return todoId as string

    // return todoUpdate as TodoUpdate
  }

}

