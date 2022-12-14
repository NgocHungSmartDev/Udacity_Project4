import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { createLogger } from '../../utils/logger';
import { getUserId } from '../../auth/utils'
import { updateTodo } from '../service/todoService'

const logger = createLogger('updateTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId;
    const userId: string = getUserId(event);
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body);
    logger.info('data update', updatedTodo)
    const updatedItem = await updateTodo(userId, todoId, updatedTodo);
    return {
      statusCode: 200,
      body: JSON.stringify({
        item: updatedItem
      })
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(cors(
    {
      origin: "*",
      credentials: true,
    }
  ))
