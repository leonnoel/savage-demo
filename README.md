# Express Mongo Message Board

A full-stack CRUD message board where anyone can post a message, give it a thumb up or thumb down, and delete it. Every action is saved to MongoDB Atlas, so the board stays the same for everyone who visits.

<img width="559" height="383" alt="Screenshot 2026-10-21 at 6 27 25 AM" src="https://github.com/user-attachments/assets/b0b93d3d-f542-4630-9f04-3938d4ebe5db" />

## How It's Made:

**Tech used:**

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS-1572B6?style=for-the-badge&logo=css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![EJS](https://img.shields.io/badge/EJS-B4CA65?style=for-the-badge&logo=ejs&logoColor=black)
![MongoDB Atlas](https://img.shields.io/badge/MongoDB_Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)

This app is built on Express with the native MongoDB driver. When the server starts, it connects to a MongoDB Atlas cluster and stores messages in their own `savage-demo` database.

The home route reads every message from the database and passes the array to an EJS template, which loops through it and renders each message with its vote count and action icons. New messages are submitted through a form that posts to `/messages`, and each one is saved with a starting count of zero.

On the client, `main.js` attaches click listeners to each icon. When one is clicked, it reads the message's name, text, and current count from the page and sends a `fetch` request to the matching route:

- `PUT /likes` raises the count by one
- `PUT /dislikes` lowers the count by one
- `DELETE /deleteMsg` removes the message

After each request the page reloads, and the server renders the updated list.

## Optimizations

- **Added the thumbs-down feature.** I built a dedicated `/dislikes` route and gave each action its own clearly named route, so the client and server line up one to one.
- **Moved credentials out of the code.** The original project had a shared demo connection string hardcoded in `server.js`. I connected it to my own MongoDB Atlas cluster and moved the connection string into a `.env` file loaded with `dotenv`, so my username and password never get committed to GitHub.
- **Made it deployable.** The server originally listened on a fixed port. I changed it to use `process.env.PORT` with 3000 as a local fallback, so it runs on Render without any code changes.
- **Gave the app its own database.** Messages are stored in a dedicated `savage-demo` database, so they stay separate from my other projects on the same cluster.

A future improvement would be switching the vote routes from `$set` to MongoDB's `$inc` operator, so the server updates the count directly instead of trusting the number sent from the browser.

## Lessons Learned:

This project taught me how the pieces of a full-stack app hand data to each other. A click in the browser becomes a `fetch` request, the request hits an Express route, the route updates MongoDB, and a page reload renders the new data through EJS. Seeing that full loop made CRUD click for me.

I also learned how deployment actually works. Hosting platforms like Render assign their own port, and secrets can't live in the code. Environment variables solve both problems: the same code reads from a local `.env` file during development and from Render's environment settings in production.

## Installation

1. Clone the repo
2. Run `npm install`
3. Create a `.env` file in the root with your MongoDB connection string:
   ```
   MONGO_URL=your_mongodb_connection_string
   ```
4. Run `npm run savage`
5. Navigate to `localhost:3000`
