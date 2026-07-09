# CSE 341 - W01 Project (Contacts Part 1)

This project completes **Part 1** of the contacts API assignment:

- Set up project and database
- Import sample data
- Build GET routes (`get all` and `get one by id`)
- Deploy to Render

## What is included in this code

- MongoDB connection using environment variables
- `GET /contacts` for all contacts
- `GET /contacts/:id` for one contact
- Basic `.rest` file for route testing

## Local setup

1. Install packages

```bash
npm install
```

2. Create a `.env` file in the project root.
Use `.env.example` as a guide.

Optional: use `data/contacts.json` as starter data when importing contacts into MongoDB.

3. Add your connection string to `.env`:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=8080
```

4. Start the server

```bash
npm start
```

## Test routes

- `GET http://localhost:8080/contacts`
- `GET http://localhost:8080/contacts?id=<replace_with_valid_id>`
- `GET http://localhost:8080/contacts/<replace_with_valid_id>`

You can use the `requests.rest` file with the VS Code REST Client extension.

## Render deployment notes

1. Push this project to GitHub.
2. Create a new Web Service in Render from your GitHub repo.
3. Set start command to:

```bash
node server.js
```

4. In Render environment variables, add:

- `MONGODB_URI` = your MongoDB connection string
- `PORT` = `8080` (optional, Render also provides its own port)

5. Test deployed routes:

- `https://your-render-url/contacts`
- `https://your-render-url/contacts/<id>`
