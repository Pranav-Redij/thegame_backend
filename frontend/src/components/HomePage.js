import '../style/HomePage.css';
import { useNavigate, Link } from 'react-router-dom';

function HomePage() {
  return (
    <>
      <nav className="navbar">
        <h2 className="nav-left">--- TIC TAC TOE ---</h2>
        <div className="nav-right">
          <Link to="/"><button className="nav-btn logout-btn">Logout</button></Link>
        </div>
      </nav>

      <div className="container">
        <div className="menu-wrapper">

          <Link to="/offlinemultiboard"><div className="menu-item">
            <button className="menu-tab">
              Play Offline
            </button>
          </div></Link>

          <div className="menu-item">
            <button className="menu-tab">
              Play vs AI
            </button>

            <div className="submenu">
              <Link to="/aieasymultiboard"><button>Easy</button></Link>
              <Link to="/aimediummultiboard"><button>Medium</button></Link>
              <Link to="/aihardmultiboard"><button>Hard</button></Link>
            </div>
          </div>

          <div className="menu-item">
            <button className="menu-tab">
              Play Online
            </button>

            <div className="submenu">
              <Link to="/playwithfriend"><button>Play with Friend</button></Link>
              <Link to="/matchmaking"><button>Matchmaking</button></Link>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default HomePage;