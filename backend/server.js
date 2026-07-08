const express = require('express');
require('dotenv').config();
const app = express();
const cors = require("cors");
const allowedOrigins = [
  "http://localhost:3000",                        // for local development
  process.env.FRONTEND_URL                        // your deployed Netlify frontend, e.g. https://your-site.netlify.app
].filter(Boolean);

console.log("Allowed CORS origins:", allowedOrigins);

app.use((req, res, next) => {
  console.log("Incoming request origin:", JSON.stringify(req.headers.origin));
  next();
});

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

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
