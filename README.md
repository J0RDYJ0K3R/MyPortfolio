# MyPortfolio — Assignment 2

React/Vite client plus Node/Express/Mongoose backend, based on the class MERN skeleton.

## Run

1. Install Node.js 20+.
2. In project root run `npm install` and `npm install --prefix client`.
3. Copy `.env.example` to `.env` and set `MONGO_URI` (use MongoDB database **Portfolio**, not reactPortfolio) and a unique `JWT_SECRET` of at least 32 characters. Never commit `.env`.
4. Run **`npm run dev`** from the root; client http://localhost:5173 and backend http://localhost:5000.
5. Backend welcome: http://localhost:5000/.

The MongoDB Atlas database name must be Portfolio in the connection URI, for example `mongodb+srv://USER:ENCODED_PASSWORD@HOST/Portfolio`. Your earlier database `reactPortfolio` is not automatically renamed or copied. To populate Portfolio, create records via APIs. Previously created documents stay in the old database until migrated.

## API endpoints

All routes use `/api`. Contacts, projects, qualifications, and users have GET all, GET by ID, POST, PUT by ID, DELETE by ID. Contact POST is public for website form; reading/editing/deleting contacts requires JWT. Projects GET is public; writes require JWT. Qualifications require JWT for all operations. User records require JWT, with ownership checks for GET by ID, PUT, DELETE. `/api/users` GET lists basic user data without password hashes; use only in a trusted/local assignment environment. `/api/users` POST creates a user for assignment CRUD demonstration and requires a JWT; public registration is `/api/auth/register`.

Authentication routes: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout` (JWT stateless signout: client must discard the token; issued JWT remains valid until expiry).

Request bodies:
- `POST /api/projects`: `{ "title":"Portfolio", "description":"Demo", "completionDate":"2026-10-14" }`
- `POST /api/qualifications`: `{ "title":"Diploma", "description":"Study", "completionDate":"2026-10-14" }`
- `POST /api/contacts`: `{ "firstName":"Test", "lastName":"User", "email":"test@example.com", "message":"Hello" }`
- `POST /api/auth/register`: `{ "name":"Test User", "email":"test@example.com", "password":"use-your-own-password" }`
- `POST /api/auth/login`: `{ "email":"test@example.com", "password":"use-your-own-password" }`

For protected routes set `Authorization: Bearer <token>` from login. **Do not show passwords or JWTs in screenshots.** Screenshots should show API request method, URL, status, response and test records for the rubric.

## Important security notes

Original skeleton embedded a hardcoded Atlas URI and an unsafe plaintext-password User model; both have been removed. Rotate any exposed database credentials. The local contact endpoint is intended for assignment demonstration; add rate limiting/spam protection before public deployment. Do not commit `.env`, logs or `node_modules`.

## Submission

ZIP the MyPortfolio folder (excluding `.env`, `node_modules`, `.git`, and `dist`), push project to GitHub, and submit a Word document with genuine screenshots from MongoDB Atlas and API testing. Installation and real external database connectivity must be verified on your machine.
