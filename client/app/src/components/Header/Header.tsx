import { Link } from "react-router-dom";
import "./Header.css";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import socketIOClient from "socket.io-client";
const ENDPOINT = `http://${import.meta.env.VITE_DOMAIN}:8000`;
import Cookies from "js-cookie";
let mytoken = Cookies.get("jwt") || "";
const socket = socketIOClient(ENDPOINT, {
  transports: ["websocket"],
  query: {
    token: mytoken,
  },
  transportOptions: {
    extraHeaders: {
      Authorization: `Bearer ${mytoken}`,
    },
  },
});

const Header = () => {
  const navigate = useNavigate();

  useEffect(() => {
  const handleClick = (idUser: string, roomName: string, idUser2: string) => {
    socket.emit('accepted', idUser);
    navigate(`/Game?CustomRoom=1&roomName=${roomName}&idUser2=${idUser2}`);
  };

    socket.on("customRoom", (idUser: string, roomName: string, idUser2: string) => {
      toast((t) => (
        <span>
          SOME ONE INVITE YOU TO PLAY
          <button onClick={() => {
            toast.dismiss(t.id)
            handleClick(idUser, roomName, idUser2)
            }}>PLAY</button>
        </span>
      ));
    });
  }, []);

  const [matches, setMatches] = useState([])

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
      }
      else{
        setMatches([]);
      }
    }
    catch(error: any){
      console.error("Error fetching data:", error.response.data.message);
      setMatches([]);
    }
  }

  return (
    <div className="container2">
      <div className="search-box">
      <input
          placeholder="SEARCH HERE FOR PEOPLE"
          type="text"
          onChange={handleChange}
          className="search"
        />
        <ul className="searchList">
            {matches.map((user: any) => (
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
        <Link to="/friends">
          <i className="fa-solid fa-user-group awsomeCss"></i>
        </Link>
        <Link to="/Settings">
          <i className="fa-solid fa-gear awsomeCss"></i>
        </Link>
        <Link to="/">
          <i className="fa-solid fa-house awsomeCss"></i>
        </Link>
      </div>
    </div>
  );
};

export default Header;
