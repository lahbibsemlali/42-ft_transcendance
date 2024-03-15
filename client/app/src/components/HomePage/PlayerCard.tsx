import { useEffect, useState } from "react";
import Overview from "./Overview.tsx";
import Play from "./Play.tsx";
import styles from "./PlayerCard.module.css";
import axios from "axios";
import Cookies from "js-cookie";
const backend = `http://${import.meta.env.VITE_DOMAIN}:8000/api`

function PlayerCard() {
  const [image, setImage] = useState('')
  const [username, setUsername] = useState('')
  // const [image, setImage] = useState('')

  useEffect(() => {
    const fetcher = async () => {
      const res = await axios(`${backend}/user/getUserData`, {
        headers: {
          Authorization: `bearer ${Cookies.get('jwt')}`
        }
      })
      setImage(res.data.avatar)
      setUsername(res.data.username)
    }
    fetcher()
  }, [])
  return (
    <div className={styles.Player}>
      <h1 className={styles.more}>Player Card</h1>
      <img src={image} alt="Player's avatar" className={styles.avatar} />
      <h2 className={styles.username}>{username}</h2>
      <Overview />
      {/* <h2 className={styles.playText}>New Game </h2> */}
      <Play />
    </div>
  );
}

export default PlayerCard;
