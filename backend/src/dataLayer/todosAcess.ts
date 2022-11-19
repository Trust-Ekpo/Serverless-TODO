import * as AWS from 'aws-sdk'
// import * as AWSXRay from 'aws-xray-sdk'
// import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
var AWSXRay = require('aws-xray-sdk');
// import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic 
export class TodosAccess {
  constructor(
    private readonly todosTable = process.env.TODOS_TABLE,  
    private readonly docClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly todosIndex = process.env.INDEX_NAME
  ){}

  async getAllTodos(userId: string): Promise<TodoItem[]> {
    logger.info('Get all todos function called')

    const result = await this.docClient
    .query({
      TableName: this.todosTable,
      IndexName: this.todosIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAtrributeValues: {
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
}