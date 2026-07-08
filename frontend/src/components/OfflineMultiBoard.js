import { useState } from 'react';
import '../style/Board.css'; 
import { useNavigate, Link } from 'react-router-dom';


function Square({ value, onSquareClick }) {
  return (
    <button
      className={`square ${value === 'X' ? 'x' : value === 'O' ? 'o' : ''}`}
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
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function OfflineMultiBoard(){
  const [squares,setSquares] = useState(Array(9).fill(null));
  const [xturn,setIsxturn] = useState(true);

  function handlePlayAgain() {
    setSquares(Array(9).fill(null));
    setIsxturn(true);
  }

  function handleClick(i){
    const nextSquares = squares.slice();  

  if (squares[i] || calculateWinner(squares)) {
    return;
  }

    if(xturn===true){
    nextSquares[i]= 'X';
    setIsxturn(false);
    }
    else{
      nextSquares[i]= 'O';
      setIsxturn(true);
    }
    setSquares(nextSquares);
  }


  const winner = calculateWinner(squares);
  const isDraw = !winner && squares.every(cell => cell !== null);

  let status;

  if (winner) {
    status = "Winner: " + winner;
  } else if (isDraw) {
    status = "Draw!";
  }else {
    status = "Next player: " + (xturn ? "X" : "O");
  }

  return (
    <>
      <nav className="navbar">
          <h2 className="nav-left">--- TIC TAC TOE ---</h2>
          <div className="nav-right">
            <Link to="/home" className="nav-link"><button className="nav-btn home-btn">Home</button></Link>
            <Link to="/" className="nav-link"><button className="nav-btn logout-btn">Logout</button></Link>
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

          {(winner || isDraw) && (<div className="play-again-container"><button className="play-again-btn" onClick={handlePlayAgain}>Play Again</button></div>)}

      </div>
      </div>
    </>
  );
}

export default OfflineMultiBoard;