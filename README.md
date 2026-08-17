# 🎮 Tic Tac Toe

A full-stack multiplayer Tic Tac Toe web application built with **React, Node.js, Express, MongoDB, JWT, and Socket.IO**.

The application supports offline gameplay, AI opponents with multiple difficulty levels, online multiplayer with friends, and real-time matchmaking.

## 🚀 Features

* 🔐 **User Authentication**

  * User signup and login
  * Password hashing using bcrypt
  * JWT-based authentication

* 🎯 **Multiple Game Modes**

  * Play Offline
  * Play against AI

    * Easy
    * Medium
    * Hard
  * Play Online with Friends
  * Random Online Matchmaking

* 👥 **Friends System**

  * Add users as friends
  * View friend list
  * See online/offline status
  * Send game invitations
  * Accept or reject game requests

* ⚡ **Real-Time Multiplayer**

  * Socket.IO-based communication
  * Real-time moves
  * Online user tracking
  * Friend invitations
  * Automatic matchmaking
  * Private game rooms

* 🤖 **AI Gameplay**

  * Easy: Random moves
  * Medium: Combination of random moves and Minimax
  * Hard: Minimax-based optimal moves

* 🗄️ **MongoDB Database**

  * Stores user accounts
  * Stores hashed passwords
  * Maintains friend relationships

---

## 🛠️ Tech Stack

### Frontend

* React
* React Router
* Axios
* Socket.IO Client
* CSS

### Backend

* Node.js
* Express.js
* Socket.IO
* MongoDB
* Mongoose
* JWT
* bcrypt
* CORS
* dotenv

---

## 🏗️ Architecture

```text
                    ┌──────────────────────┐
                    │      React UI        │
                    │      Frontend        │
                    └──────────┬───────────┘
                               │
                    REST API / Socket.IO
                               │
             ┌─────────────────┴─────────────────┐
             │                                   │
     ┌───────▼────────┐                ┌─────────▼────────┐
     │ Express Server  │                │   Socket.IO      │
     │    REST API     │                │ Real-Time Games  │
     └───────┬────────┘                └─────────┬─────────┘
             │                                   │
             └─────────────────┬─────────────────┘
                               │
                     ┌─────────▼─────────┐
                     │      MongoDB      │
                     │   User Database   │
                     └───────────────────┘
```

---

## 📁 Project Structure

```text
TICTACTOE/
│
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   ├── logo.png
│   │   └── manifest.json
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── HomePage.js
│   │   │   ├── Login.js
│   │   │   ├── Signup.js
│   │   │   ├── ProtectedRoute.js
│   │   │   ├── OfflineMultiBoard.js
│   │   │   ├── AIEasyMultiBoard.js
│   │   │   ├── AIMediumMultiBoard.js
│   │   │   ├── AIHardMultiBoard.js
│   │   │   ├── OnlineBoard.js
│   │   │   ├── PlayWithFriend.js
│   │   │   ├── Matchmaking.js
│   │   │   └── config.js
│   │   │
│   │   ├── style/
│   │   ├── App.css
│   │   ├── index.css
│   │   └── index.js
│   │
│   └── package.json
│
└── backend/
    ├── models/
    │   └── users.js
    │
    ├── routes/
    │   ├── userRoutes.js
    │   └── usersfriendRoutes.js
    │
    ├── db.js
    ├── jwt.js
    ├── socket.js
    ├── server.js
    ├── package.json
    └── .env
```

---

# 🔐 Authentication

The application uses **JWT authentication**.

### Signup

```http
POST /user/signup
```

Request:

```json
{
  "username": "player1",
  "password": "password123"
}
```

Response:

```json
{
  "token": "JWT_TOKEN",
  "user": {
    "id": "USER_ID",
    "username": "player1"
  }
}
```

### Login

```http
POST /user/login
```

Request:

```json
{
  "username": "player1",
  "password": "password123"
}
```

The server verifies the password using bcrypt and returns a JWT valid for **7 days**.

Authenticated requests use:

```http
Authorization: Bearer <JWT_TOKEN>
```

---

# 👥 Friends API

### Get Friends

```http
GET /friends
```

Requires JWT authentication.

Returns the authenticated user's friend list.

### Add Friend

```http
POST /friends/add
```

Request:

```json
{
  "friendUsername": "player2"
}
```

The API:

* Checks whether the user exists
* Prevents adding yourself
* Prevents duplicate friendships
* Creates a two-way friendship

---

# ⚡ Real-Time Multiplayer

Socket.IO handles the real-time multiplayer functionality.

### Main Socket Events

| Event                   | Purpose                     |
| ----------------------- | --------------------------- |
| `user_online`           | Marks a user as online      |
| `online_users_updated`  | Updates online users        |
| `play_request`          | Sends a game invitation     |
| `play_request_received` | Receives a game invitation  |
| `accept_request`        | Accepts an invitation       |
| `reject_request`        | Rejects an invitation       |
| `room_created`          | Creates a private game room |
| `join_room`             | Joins a game room           |
| `make_move`             | Sends a player's move       |
| `move_made`             | Broadcasts a move           |
| `join_matchmaking`      | Enters matchmaking queue    |
| `matchmaking_matched`   | Notifies players of a match |
| `leave_matchmaking`     | Leaves matchmaking queue    |

---

# 🎮 Online Game Flow

### Play With Friend

```text
Player A
   │
   │ Select Friend
   ▼
play_request
   │
   ▼
Player B
   │
   ├── Accept ──► accept_request
   │                  │
   │                  ▼
   │             Room Created
   │                  │
   └──────────────────┤
                      ▼
                 Online Game
```

Each player receives a symbol:

```text
Player 1 → X
Player 2 → O
```

Moves are sent through Socket.IO and broadcast to both players in real time.

---

# 🔎 Matchmaking

The matchmaking system maintains an in-memory queue on the Socket.IO server.

```text
Player A → Matchmaking Queue
                     │
Player B → Matchmaking Queue
                     │
                     ▼
                Match Found
                     │
              ┌──────┴──────┐
              ▼             ▼
             X              O
          Player A       Player B
```

When two players are available, the server automatically creates a game room and notifies both clients.

---

# 🤖 AI Game Modes

## Easy

The AI selects an available cell randomly.

```text
Human Move
    ↓
Find Empty Cells
    ↓
Random Selection
    ↓
AI Move
```

## Medium

The AI combines:

* Random moves
* Minimax-based moves

This provides a less predictable opponent while maintaining moderate difficulty.

## Hard

The AI uses the **Minimax algorithm** to evaluate possible game states and select the optimal move.

```text
Current Board
     ↓
Generate Possible Moves
     ↓
Minimax Evaluation
     ↓
Evaluate Game States
     ↓
Select Best Move
```

The algorithm recursively evaluates winning, losing, and draw positions.

---

# 🗄️ Database

MongoDB is used for persistent user data.

### User Schema

```text
User
├── username
├── password
└── friends[]
```

Passwords are never stored directly. Before saving a user, the password is hashed using **bcrypt**.

Friend relationships are stored using MongoDB ObjectIds referencing other users.

---

# ⚙️ Environment Variables

Create a `.env` file inside the `backend` directory.

```env
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000
PORT=5001
```

For production, replace `FRONTEND_URL` with the deployed frontend URL.

**Do not commit `.env` to GitHub.**

---

# 💻 Installation

## 1. Clone the Repository

```bash
git clone https://github.com/Pranav-Redij/thegame_backend.git
```

If your repository contains both frontend and backend:

```bash
cd TICTACTOE
```

---

## 2. Install Backend Dependencies

```bash
cd backend
npm install
```

Configure the `.env` file:

```env
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:3000
PORT=5001
```

Start the backend:

```bash
npm start
```

The backend runs on:

```text
http://localhost:5001
```

---

## 3. Install Frontend Dependencies

Open another terminal:

```bash
cd frontend
npm install
```

Start the React application:

```bash
npm start
```

The frontend runs on:

```text
http://localhost:3000
```

---

# 🔄 Application Flow

```text
User
 │
 ▼
Signup / Login
 │
 ▼
JWT Authentication
 │
 ▼
Home Page
 │
 ├───────────────┐
 │               │
 ▼               ▼
Offline        Play vs AI
 │               │
 │          ┌────┼────┐
 │          ▼    ▼    ▼
 │        Easy Medium Hard
 │
 ▼
Play Online
 │
 ├───────────────┐
 │               │
 ▼               ▼
Friend        Matchmaking
 │               │
 ▼               ▼
Invite          Queue
 │               │
 ▼               ▼
Accept        Match Found
 │               │
 └───────┬───────┘
         ▼
   Online Game
         │
         ▼
     Socket.IO
         │
         ▼
   Real-Time Moves
```

---

# 🔒 Security

The project implements several basic security mechanisms:

* Password hashing with bcrypt
* JWT-based authentication
* Protected API routes
* Environment variables for secrets
* CORS configuration
* MongoDB-backed user authentication

---

# 🌐 Deployment

The frontend and backend can be deployed separately.

### Frontend

Possible platforms:

* Netlify
* Vercel

### Backend

Possible platforms:

* Render
* Railway
* Other Node.js hosting platforms

For deployment, configure:

```env
MONGO_URL=...
JWT_SECRET=...
FRONTEND_URL=https://your-frontend-url
PORT=...
```

The frontend should also use the deployed backend URL in its configuration.

---

# 🧪 Local Development

Run the backend:

```bash
cd backend
npm install
npm start
```

Run the frontend in a separate terminal:

```bash
cd frontend
npm install
npm start
```

Then open:

```text
http://localhost:3000
```

---

# 📌 Key Concepts Demonstrated

This project demonstrates practical implementation of:

* Full-stack web development
* React component-based architecture
* REST APIs
* JWT authentication
* Password hashing
* MongoDB/Mongoose
* WebSocket communication
* Socket.IO rooms
* Real-time multiplayer games
* Matchmaking systems
* Online presence tracking
* Friend management
* Minimax game AI
* Client-server communication
* CORS configuration

---

# 🔮 Future Improvements

* Game history and statistics
* Leaderboards and player rankings
* ELO-based matchmaking
* Rematch functionality
* Persistent online game records
* Improved matchmaking based on player skill
* Spectator mode
* Chat during multiplayer games
* Player profiles
* Better disconnect/reconnection handling
* Server-side game-state validation

---

## 👨‍💻 Author

**Pranav Redij**

Computer Engineering / Computer Science

---

## ⭐ Project

A full-stack Tic Tac Toe platform combining **AI gameplay, authentication, friends, matchmaking, and real-time multiplayer communication** into a single web application.
