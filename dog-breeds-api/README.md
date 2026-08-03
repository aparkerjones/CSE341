# CSE 341 - W03/W04 Project (Dog Breeds API)

This project now covers both parts of the two-week project:

- New Node.js API project
- MongoDB connection with a new database
- CRUD routes for the primary collection (`breeds`)
- Validation and error handling on routes
- Swagger API documentation at `/api-docs`
- Second collection included (`sizeProfiles`)
- OAuth authentication with GitHub
- Protected write routes for API data changes

## Collections

1. `breeds` (primary collection with 13 core fields)
2. `sizeProfiles` (supporting collection for weight/height ranges)

## Local setup

1. Install packages

```bash
npm install
```

2. Create a `.env` file in the project root. Use `.env.example` as a guide.

3. Add your environment values:

```env
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB=dog-breeds-db
PORT=8080
SESSION_SECRET=replace_with_long_random_secret
GITHUB_CLIENT_ID=replace_with_github_oauth_client_id
GITHUB_CLIENT_SECRET=replace_with_github_oauth_client_secret
GITHUB_CALLBACK_URL=http://localhost:8080/auth/github/callback
```

4. Start the server

```bash
npm start
```

If you prefer to keep your local settings in `dog-breeds.env`, the server will also load that file automatically when `MONGODB_URI` is not already defined.

## OAuth setup

1. Create a GitHub OAuth app at <https://github.com/settings/developers>.
2. Set homepage URL to your API URL (for example `http://localhost:8080`).
3. Set callback URL to `http://localhost:8080/auth/github/callback` for local development.
4. Copy the client id and client secret into your env file.

Authentication routes:

- `GET http://localhost:8080/auth/login`
- `GET http://localhost:8080/auth/github/callback`
- `GET http://localhost:8080/auth/me`
- `GET http://localhost:8080/auth/logout`

## Test routes

Primary CRUD routes:

- `GET http://localhost:8080/breeds`
- `GET http://localhost:8080/breeds/<id>`
- `POST http://localhost:8080/breeds` (requires auth)
- `PUT http://localhost:8080/breeds/<id>` (requires auth)
- `DELETE http://localhost:8080/breeds/<id>` (requires auth)

Supporting routes:

- `GET http://localhost:8080/size-profiles`
- `GET http://localhost:8080/size-profiles/<id>`
- `POST http://localhost:8080/size-profiles` (requires auth)
- `PUT http://localhost:8080/size-profiles/<id>` (requires auth)
- `DELETE http://localhost:8080/size-profiles/<id>` (requires auth)

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
- `SESSION_SECRET`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `GITHUB_CALLBACK_URL` = `https://your-render-url/auth/github/callback`

5. Verify deployed routes and `/api-docs`.
