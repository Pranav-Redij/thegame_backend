import '../style/Matchmaking.css';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

import BASE_URL from './config';

import io from 'socket.io-client';
const socket = io(BASE_URL);

function Matchmaking() {

  const navigate = useNavigate();

  const [searching, setSearching] = useState(false);

  const username = localStorage.getItem('username');
  const userId = localStorage.getItem('userId');


  // ==========================
  // SOCKET EVENTS
  // ==========================

  useEffect(() => {
    socket.on('matchmaking_matched',(data) => {
      setSearching(false);
      navigate('/onlineboard',
        {
          state: {roomId:data.roomId,
            mySymbol:data.mySymbol,
            myUsername:username,
            opponentUsername:data.opponentUsername}
        }
      );
    });

    return () => {
      socket.off('matchmaking_matched');
    };
  }, []);


  // ==========================
  // FIND MATCH
  // ==========================

  const handleFindMatch = () => {
    setSearching(true);
    socket.emit('join_matchmaking',{userId,username});
  };


  // ==========================
  // CANCEL SEARCH
  // ==========================

  const handleCancel = () => {
    setSearching(false);
    socket.emit('leave_matchmaking',{userId});
  };

  return (
    <>
      <nav className="navbar">
        <h2 className="nav-left">--- TIC TAC TOE ---</h2>
        <div className="nav-right">
          <Link to="/home"><button className="nav-btn home-btn">Home</button></Link>
          <Link to="/"><button className="nav-btn logout-btn">Logout</button></Link>
        </div>
      </nav>

      <div className="container">
        <div className="matchmaking-card">
          <h1 className="matchmaking-title">Matchmaking</h1>
          <p className="matchmaking-sub">Get matched with a random online player</p>

          {!searching && (
            <button className="find-btn" onClick={handleFindMatch}>Find Match</button>
          )}

          {searching && (
            <div className="searching-section">
              <div className="spinner"></div>
              <p className="searching-text">Searching for opponent...</p>
              <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Matchmaking;
