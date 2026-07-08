import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

import io from "socket.io-client";

import "../style/Board.css";
import BASE_URL from "./config";

const socket = io(BASE_URL);

function Square({ value, onSquareClick }) {
  return (
    <button
      className={`square ${value === "X" ? "x" : value === "O" ? "o" : ""}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];

    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
}

function OnlineBoard() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const location = useLocation();

  const navigate = useNavigate();

  const gameData = location.state || {};

  const { roomId, mySymbol, myUsername, opponentUsername } = gameData;

  const [currentTurn, setCurrentTurn] = useState("X");

  const winner = calculateWinner(squares);

  const isDraw = !winner && squares.every((cell) => cell !== null);

  const xPlayer = mySymbol === "X" ? myUsername : opponentUsername;

  const oPlayer = mySymbol === "O" ? myUsername : opponentUsername;

  // Game finished
  useEffect(() => {
    if (!winner && !isDraw) {
      return;
    }

    const timer = setTimeout(() => {
      if (winner) {
        alert(`Winner: ${winner === "X" ? xPlayer : oPlayer}`);
      } else {
        alert("Match Draw!");
      }

      navigate("/playwithfriend");
    }, 2000);

    return () => clearTimeout(timer);
  }, [winner, isDraw, navigate, xPlayer, oPlayer]);

  useEffect(() => {
    if (!roomId) return;

    socket.emit("join_room", {
      roomId,
    });

    socket.on("move_made", ({ index, symbol }) => {
      setSquares((prev) => {
        const next = [...prev];

        next[index] = symbol;

        return next;
      });

      setCurrentTurn(symbol === "X" ? "O" : "X");
    });

    socket.on("opponent_disconnected", () => {
      alert("Opponent disconnected.");

      navigate("/playwithfriend");
    });

    return () => {
      socket.off("move_made");

      socket.off("opponent_disconnected");
    };
  }, [roomId, navigate]);

  function handleClick(index) {
    if (!roomId || squares[index] || winner) {
      return;
    }

    if (currentTurn !== mySymbol) {
      return;
    }

    socket.emit("make_move", {
      roomId,
      index,
      symbol: mySymbol,
    });
  }

  if (!roomId) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "24px",
        }}
      >
        Invalid Game Session
      </div>
    );
  }

  let status = "";

  if (winner) {
    status = `Winner: ${winner === "X" ? xPlayer : oPlayer}`;
  } else if (isDraw) {
    status = "Draw!";
  } else {
    status = `Next Player: ${currentTurn === "X" ? xPlayer : oPlayer}`;
  }

  return (
    <>
      <nav className="navbar">
        <h2 className="nav-left">--- TIC TAC TOE ---</h2>

        <div className="nav-right">
          <Link to="/home">
            <button className="nav-btn home-btn">Home</button>
          </Link>

          <Link to="/">
            <button className="nav-btn logout-btn">Logout</button>
          </Link>
        </div>
      </nav>

      <div className="container">
        <div className="board-container">
          <div className="status">{status}</div>

          <div className="board-row">
            <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
            <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
            <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
          </div>

          <div className="board-row">
            <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
            <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
            <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
          </div>

          <div className="board-row">
            <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
            <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
            <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
          </div>
        </div>
      </div>
    </>
  );
}

export default OnlineBoard;
