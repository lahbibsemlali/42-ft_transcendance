import { useEffect, useState } from "react";
import Overview from "./Overview.tsx";
import styles from "./ProfileCard.module.css";
import axios from "axios";
import Cookies from "js-cookie";
import AddFriend from "./AddFriend.tsx";
import BlockFriend from "./Block.tsx";
const backend = `http://${import.meta.env.VITE_DOMAIN}:8000/api`

function ProfileCard({prop}: {prop: any}) {
  const [image, setImage] = useState('')
  const [username, setUsername] = useState('')
  // const [image, setImage] = useState('')
  // const [image, setImage] = useState('')
  useEffect(() => {
    const fetcher = async () => {
      const res = await axios(`${backend}/user/getFriendProfile?id=${prop}`, {
        headers: {
          Authorization: `bearer ${Cookies.get('jwt')}`
        }
      })
      setImage(res.data.avatar)
      setUsername(res.data.username)
    }
    fetcher()
  }, [])
  console.log()
  return (
    <div className={styles.Player}>
      <h1 className={styles.more}>{username}</h1>
      <img src={image} alt="Player's avatar" className={styles.avatar} />
      <Overview prop={prop}/>
      <AddFriend prop={prop}/>
      <BlockFriend prop={prop}/>
    </div>
  );
}

export default ProfileCard;
