# CSE 341 - W03 Project (Dog Breeds API)

This project covers **Week 03 Part 1** requirements for the two-week project:

- New Node.js API project
- MongoDB connection with a new database
- CRUD routes for the primary collection (`breeds`)
- Validation and error handling on routes
- Swagger API documentation at `/api-docs`
- Second collection included (`sizeProfiles`)

## Collections

1. `breeds` (primary collection with 13 core fields)
2. `sizeProfiles` (supporting collection for weight/height ranges)

## Local setup

1. Install packages

```bash
npm install
```

2. Create a `.env` file in the project root. Use `.env.example` as a guide.

3. Add your connection string and port:

```env
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB=dog-breeds-db
PORT=8080
```

4. Start the server

```bash
npm start
```

## Test routes

Primary CRUD routes:

- `GET http://localhost:8080/breeds`
- `GET http://localhost:8080/breeds/<id>`
- `POST http://localhost:8080/breeds`
- `PUT http://localhost:8080/breeds/<id>`
- `DELETE http://localhost:8080/breeds/<id>`

Supporting routes:

- `GET http://localhost:8080/size-profiles`
- `GET http://localhost:8080/size-profiles/<id>`
- `POST http://localhost:8080/size-profiles`
- `PUT http://localhost:8080/size-profiles/<id>`
- `DELETE http://localhost:8080/size-profiles/<id>`

Swagger UI:

- `http://localhost:8080/api-docs`

Use `requests.rest` with the VS Code REST Client extension for quick testing.

## Seed data

- `data/breeds.json`
- `data/sizeProfiles.json`
- `dogbreeds.seed.mongodb.js` (Mongo Shell seed script)

## Render notes

1. Push this folder to GitHub.
2. Create a new Web Service in Render.
3. Set start command to `node server.js`.
4. Add Render environment variables:

- `MONGODB_URI`
- `MONGODB_DB` = `dog-breeds-db`
- `PORT` (optional)

5. Verify deployed routes and `/api-docs`.

## Week 04 reminder

OAuth/authentication is not included yet. That is the Week 04 completion item.
