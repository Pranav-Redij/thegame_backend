import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from "./components/ProtectedRoute";

import OfflineMultiBoard from './components/OfflineMultiBoard';
import HomePage from './components/HomePage';
import AIHardMultiBoard from './components/AIHardMultiBoard';
import AIEasyMultiBoard from './components/AIEasyMultiBoard';
import AIMediumMultiBoard from './components/AIMediumMultiBoard';
import Signup from './components/Signup';
import Login from './components/Login';
import PlayWithFriend from './components/PlayWithFriend';
import OnlineBoard from './components/OnlineBoard';
import Matchmaking from './components/Matchmaking';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <Router>
    <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/offlinemultiboard" element={<ProtectedRoute><OfflineMultiBoard /></ProtectedRoute>} />
          <Route path="/aihardmultiboard" element={<ProtectedRoute><AIHardMultiBoard /></ProtectedRoute>} />
          <Route path="/aimediummultiboard" element={<ProtectedRoute><AIMediumMultiBoard /></ProtectedRoute>} />
          <Route path="/aieasymultiboard" element={<ProtectedRoute><AIEasyMultiBoard /></ProtectedRoute>} />
          <Route path="/playwithfriend" element={<ProtectedRoute><PlayWithFriend /></ProtectedRoute>} />
          <Route path="/matchmaking" element={<ProtectedRoute><Matchmaking /></ProtectedRoute>} />
          <Route path="/onlineboard" element={<ProtectedRoute><OnlineBoard /></ProtectedRoute>} />
      </Routes>
    </Router>
  </>
);
