import { defineAuth } from "@aws-amplify/backend";
import { type ClientSchema, a, defineData } from '@aws-amplify/backend';


export const auth = defineAuth({
  loginWith: {
    email: {
      verificationEmailStyle: "CODE",
      verificationEmailSubject: "Welcome to the ExpenseTracker!",
      verificationEmailBody: (createCode) =>
        `Use this code to confirm your account: ${createCode()}`,
    },
  },
});

const schema = a.schema({
  Expense: a
    .model({
      name:a.string(),
      amount: a.float(),
    })
    .authorization((allow) => [allow.owner()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});