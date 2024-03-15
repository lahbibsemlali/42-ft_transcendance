import { useEffect, useState } from "react";
import Overview from "./Overview.tsx";
import styles from "./ProfileCard.module.css";
import axios from "axios";
import Cookies from "js-cookie";
import AddFriend from "./AddFriend.tsx";
import BlockFriend from "./Block.tsx";
import Online from "./Online.tsx";
import Offline from "./Offline.tsx";
import InGame from "./InGame.tsx";
const backend = `http://${import.meta.env.VITE_DOMAIN}:8000/api`

function ProfileCard({prop}: {prop: any}) {
  const [image, setImage] = useState('')
  const [username, setUsername] = useState('')
  const [status, setStatus] = useState(0)
  const [inGame, setIngame] = useState(false)

  useEffect(() => {
    const fetcher = async () => {
      try {
        const res = await axios(`${backend}/user/getFriendProfile?id=${prop}`, {
          headers: {
            Authorization: `bearer ${Cookies.get('jwt')}`
          }
        })
        setImage(res.data.avatar)
        setUsername(res.data.username)
        setStatus(res.data.state)
        setIngame(res.data.inGame)
      }
      catch (err) {
      }
    }
    fetcher()
  }, [])
  return (
    <div className={styles.Player}>
      <div className={styles.onlineI}>
        {!inGame && status > 0 && <Online/>}
        {!inGame && status > 0 && <h1> Online </h1>}
        {status == 0 && <Offline/>}
        {status == 0 && <h1> Offline </h1>}
        {inGame && status > 0 && <InGame/>}
        {inGame && status > 0 && <h1>InGame</h1>}
      </div>
      <h1 className={styles.more}>Player Card</h1>
      <h2 className={styles.username}>{username}</h2>
      <img src={image} alt="Player's avatar" className={styles.avatar} />
      <Overview prop={prop}/>
      <AddFriend prop={prop}/>
      <BlockFriend prop={prop}/>
    </div>
  );
}

export default ProfileCard;
