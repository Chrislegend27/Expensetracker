import { useState, useEffect } from "react";
import {
  Authenticator,
  Button,
  Text,
  TextField,
  Heading,
  Flex,
  View,
  Grid,
  Divider,
} from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import { DataStore } from '@aws-amplify/datastore';
import "@aws-amplify/ui-react/styles.css";
import { Expense } from './models';
import outputs from "../amplify_outputs.json";

Amplify.configure(outputs);

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const expenses = await DataStore.query(Expense);
        console.log('Expenses:', expenses);
        setExpenses(expenses);
      } catch (err) {
        console.error('Error querying Expenses:', err);
        setError('Error querying Expenses');
      }
    };

    fetchExpenses();
  }, []);

  async function createExpense(event) {
    event.preventDefault();
    console.log("INFO", event.target);
    const form = new FormData(event.target);
    try {
      await DataStore.save(
        new Expense({
          name: form.get("name"),
          amount: parseFloat(form.get("amount")),
        })
      );
      event.target.reset();
      // Fetch expenses again to update the list
      const expenses = await DataStore.query(Expense);
      setExpenses(expenses);
    } catch (err) {
      console.error("Error creating expense:", err);
      setError("Error creating expense");
    }
  }

  async function deleteExpense(expense) {
    try {
      await DataStore.delete(expense);
      // Fetch expenses again to update the list
      const expenses = await DataStore.query(Expense);
      console.log(expenses)
      setExpenses(expenses);
    } catch (err) {
      console.error("Error deleting expense:", err);
      setError("Error deleting expense");
    }
  }

  return (
    <Authenticator>
      {({ signOut }) => (
        <Flex
          className="App"
          justifyContent="center"
          alignItems="center"
          direction="column"
          width="70%"
          margin="0 auto"
        >
          <Heading level={1}>Expense Tracker</Heading>
          {error && <Text color="red">{error}</Text>}
          <View as="form" margin="3rem 0" onSubmit={createExpense}>
            <Flex
              direction="column"
              justifyContent="center"
              gap="2rem"
              padding="2rem"
            >
              <TextField
                name="name"
                placeholder="Expense Name"
                label="Expense Name"
                labelHidden
                variation="quiet"
                required
              />
              <TextField
                name="amount"
                placeholder="Expense Amount"
                label="Expense Amount"
                type="number"
                labelHidden
                variation="quiet"
                required
              />
              <Button type="submit" variation="primary">
                Create Expense
              </Button>
            </Flex>
          </View>
          <Divider />
          <Heading level={2}>Expenses</Heading>
          <Grid
            margin="3rem 0"
            autoFlow="column"
            justifyContent="center"
            gap="2rem"
            alignContent="center"
          >
            {expenses.map((expense) => (
              <Flex
                key={expense.id || expense.name}
                direction="column"
                justifyContent="center"
                alignItems="center"
                gap="2rem"
                border="1px solid #ccc"
                padding="2rem"
                borderRadius="5%"
                className="box"
              >
                <View>
                  <Heading level="3">{expense.name}</Heading>
                </View>
                <Text fontStyle="italic">${expense.amount}</Text>
                <Button
                  variation="destructive"
                  onClick={() => deleteExpense(expense)}
                >
                  Delete note
                </Button>
              </Flex>
            ))}
          </Grid>
          <Button onClick={signOut}>Sign Out</Button>
        </Flex>
      )}
    </Authenticator>
  );
}
