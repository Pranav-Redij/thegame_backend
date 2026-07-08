import "../style/PlayWithFriend.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import BASE_URL from "./config";

import io from "socket.io-client";
const socket = io(BASE_URL);

function FriendPage() {

  const navigate = useNavigate();

  const [friendUsername, setFriendUsername] =useState("");
  const [friends, setFriends] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState({});

  const [invitePopup, setInvitePopup] = useState(false);
  const [inviteData, setInviteData] = useState(null);

  const username = localStorage.getItem("username");
  const userId = localStorage.getItem("userId");


  // ==========================
  // FETCH FRIENDS
  // ==========================

  const fetchFriends = async () => {
    try {
      const token =localStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}/friends`,{headers: { Authorization:`Bearer ${token}`}});
      setFriends(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchFriends();
    socket.emit("user_online",{ userId,username});
    socket.on("online_users_updated",(users) => {setOnlineUsers(users);});
    socket.on("play_request_received",(data) => {setInvitePopup(true);setInviteData(data);});
    socket.on("request_rejected",() => {alert("Friend Dont Wanna Play.....");});
    socket.on("room_created",(data) => {navigate("/onlineboard",
          {
            state: {roomId:data.roomId,
              mySymbol:data.mySymbol,
              myUsername:username,
              opponentUsername:data.opponentUsername}
          }
        );
      }
    );

    return () => {
      socket.off("online_users_updated");
      socket.off("play_request_received");
      socket.off("request_rejected");
      socket.off("room_created");
    };}, []);


  // ==========================
  // PLAY BUTTON
  // ==========================

  const handlePlay = (friendId,friendName) => {
    socket.emit("play_request",
      {
        fromUserId: userId,
        fromUsername: username,
        toUserId: friendId
      }
    );
    alert(`Invite sent to ${friendName}`);
  };


  // ==========================
  // ACCEPT
  // ==========================

  const acceptInvite = () => {
    socket.emit("accept_request",
      {
        requesterId:inviteData.fromUserId,
        accepterId:userId,
        accepterUsername:username
      }
    );

    setInvitePopup(false);
  };

  // ==========================
  // REJECT
  // ==========================

  const rejectInvite = () => {
    socket.emit("reject_request",
      {
        requesterId:
          inviteData.fromUserId
      }
    );
    setInvitePopup(false);
  };
  const addFriend = async () => {
    if (!friendUsername.trim()) return;
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${BASE_URL}/friends/add`,
        {friendUsername},
        {headers: {Authorization:`Bearer ${token}`}}
      );

      setFriendUsername("");
      fetchFriends();
      alert("Friend added");
    } catch (err) {
      alert(err?.response?.data?.error || "Failed to add friend");
    }
};

  return (
    <>
      <nav className="navbar"><h2 className="nav-left">--- TIC TAC TOE ---</h2>
        <div className="nav-right">
          <Link to="/home"><button className="nav-btn home-btn">Home</button></Link>
          <Link to="/"><button className="nav-btn logout-btn">Logout</button></Link>
        </div>
      </nav>

      <div className="container">
        <div className="friends-card">
          <h1 className="friends-title">Friends</h1>
          <div className="add-friend-section">
            <input type="text" placeholder="Enter username" value={friendUsername} onChange={(e) =>setFriendUsername(e.target.value)}/>
            <button onClick={addFriend}>Add Friend</button>
        </div>  
          <div className="friends-list">
            {friends.map((friend) => {const isOnline =onlineUsers[friend._id];
                return (
                  <div key={friend._id} className="friend-row">
                    <div className="friend-info">
                      <span>{isOnline ? "🟢" : "⚫"}</span>
                      <span className="friend-name">{friend.username}</span>
                    </div>

                    <button className="play-btn" disabled={!isOnline} onClick={() =>handlePlay(friend._id,friend.username)}>Play</button>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {invitePopup && (
        <div className="invite-popup">
          <div className="invite-card">
            <h3>{inviteData.fromUsername}{" "}wants to play</h3>
            <button onClick={acceptInvite}>Accept</button>
            <button onClick={rejectInvite}>Reject</button>
          </div>
        </div>
      )}

    </>
  );
}

export default FriendPage;