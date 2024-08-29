// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Todo, Expense } = initSchema(schema);

export {
  Todo,
  Expense
};