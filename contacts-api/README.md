# CSE 341 - W02 Project (Contacts Part 2)

This project completes **Part 2** of the contacts API assignment:

- Full CRUD routes for contacts (`GET`, `POST`, `PUT`, `DELETE`)
- Swagger API documentation and test UI at `/api-docs`
- MongoDB-backed contact collection with required fields

## What is included in this code

- MongoDB connection using environment variables
- Express routes for all required contact endpoints
- Validation and error handling for required fields
- Swagger/OpenAPI documentation in `swagger.json`
- Request samples in `requests.rest`

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
- `GET http://localhost:8080/contacts/<replace_with_valid_id>`
- `POST http://localhost:8080/contacts`
- `PUT http://localhost:8080/contacts/<replace_with_valid_id>`
- `DELETE http://localhost:8080/contacts/<replace_with_valid_id>`

Swagger UI:

- `http://localhost:8080/api-docs`

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
- `https://your-render-url/api-docs`
