import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  return (
    <div className="container2">
      <div className="search-box">
        <input
          placeholder="SEARCH HERE FOR PEOPLE"
          type="text"
          className="search"
        />
        <button className="search-btn">
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
      </div>
      <div className="iconclass">
        <Link to="/Chat">
          <i className="fa-solid fa-comments awsomeCss"></i>
        </Link>
        <i className="fa-solid fa-bell awsomeCss"></i>
        <Link to="/Settings">
          <i className="fa-solid fa-gear awsomeCss"></i>
        </Link>
        <Link to="/">
          <i className="fa-solid fa-right-from-bracket awsomeCss"></i>
        </Link>
      </div>
    </div>
  );
};

export default Header;
