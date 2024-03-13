import { Link } from "react-router-dom";
import "./Header.css";
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const Header = () => {
  const [matches, setMatches] = useState([])
  const [error, setError] = useState(null);
  const testUsers = [
    { userId: 1, username: "Simo" , Img: "/Avatar.jpeg"},
    { userId: 2, username: "Lahbib" , Img:"/Avatar.jpeg"},
    { userId: 3, username: "Hossein" , Img:"/Avatar.jpeg"},
    { userId: 4, username: "Ali" , Img:"/Avatar.jpeg"},
    { userId: 5, username: "kaabi" , Img:"/Avatar.jpeg"},
  ];
  

  const handleChange = async (e: any) => {
    const searchTerm: string = e.target.value;
    try{
      if (searchTerm.length) {
          const res = await axios(`http://${import.meta.env.VITE_DOMAIN}:8000/api/user/search?keyword=${searchTerm}`, {
            headers: {
              Authorization: `bearer ${Cookies.get('jwt')}`
            }
          })
          setMatches(() => res.data.matches);
          console.log(res.data.matches)
          // setMatches(filteredUsers);
          setError(null);
      }
      else{
        setMatches([]);
      }
    }
    catch(error){
      console.error("Error fetching data:", error.response.data.message);
      setError("Error fetching data. Please try again.");
      setMatches([]);
    }
  }

  return (
    <div className="container2">
      <div className="search-box">
      <input
          placeholder="SEARCH HERE FOR PEOPLE"
          type="text"
          // onChange={(e) => setSearch(e.target.value)}
          onChange={handleChange}
          className="search"
        />
        {error && <p className="error-message" style={{color:"red"}}>{error}</p>}
        <ul className="searchList">
            {matches.map((user) => (
              <Link to={`/profile/${user.userId}`}>
                  <li key={user.userId}>
                    <img src={user.avatar}></img>
                    <span>{user.username}</span>
                  </li>
              </Link>
                ))}
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
