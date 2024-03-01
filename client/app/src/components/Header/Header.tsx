import { Link } from "react-router-dom";
import "./Header.css";
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const Header = () => {
  const [matches, setMatches] = useState<{}>([])

  const handleChange = async (e: any) => {
    const searchTerm: string = e.target.value;
    if (searchTerm.length) {
      const res = await axios(`http://${import.meta.env.VITE_DOMAIN}:8000/api/user/search?keyword=${searchTerm}`, {
        headers: {
          Authorization: `bearer ${Cookies.get('jwt')}`
        }
      })
      console.log('matches: ', res.data)
      setMatches(() => res.data.matches);
    }
  }

  return (
    <div className="container2">
      <div className="search-box">
        <input
          placeholder="SEARCH HERE FOR PEOPLE"
          type="text"
          className="search"
          onChange={handleChange}
        />
        <ul>
          {matches.map(user => <li key={user.userId}>{user.username}</li>)}
        </ul>
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
