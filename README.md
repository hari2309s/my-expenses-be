# My expenses - Backend to track your expenses.

## Tech Stack

- Deno
- Encrypted JSON file as an on-device Database to store the expenses

## Available Scripts

In the project directory, you can run:

### `deno run --allow-net --allow-read --allow-write --allow-env --watch main.ts`

The application should be running on `http://localhost:8000`

## Available endpoints

GET `/expenses` - List all expenses
POST `/expenses` - Add a new expense
GET `/expenses/:id` - Get an expense using its ID
PUT `/expenses/:id` - Update an expense
DELETE `/expenses/:id` - Delete an expense

You can use [Postman](https://www.postman.com) to test these endpoints
