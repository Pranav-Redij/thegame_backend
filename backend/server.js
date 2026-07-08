const express = require('express');
const app = express();
const cors = require("cors");
const allowedOrigins = [
  "http://localhost:3000",                   // for local development
  "https://tracknow-frontend.vercel.app"     // your deployed frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman or same-origin)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT" , "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
require('dotenv').config();

const {jwtAuthMiddleware,generateToken} = require('./jwt.js');

const db=require('./db');
const users=require('../backend/models/users');

const userRoutes = require('./routes/userRoutes.js');
app.use('/user',userRoutes);

const userFriendRoutes = require('./routes/usersFriendRoutes');
app.use('/friends', userFriendRoutes);

app.get('/',(req,res)=>{
    res.send("Let's Play Tic Tac Toe!, online");
})


const PORT = process.env.PORT || 5001;

const http = require("http");

const server = http.createServer(app);

const initializeSocket =
require("./socket");

initializeSocket(server);

server.listen(PORT, () => {
    console.log(
        `Server running on ${PORT}`
    );
});