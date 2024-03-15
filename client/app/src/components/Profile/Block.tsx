import styles from "./Block.module.css"
const backend = `http://${import.meta.env.VITE_DOMAIN}:8000/api`
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

function BlockFriend({prop}: {prop: string}){
    const [status, setStatus] = useState(0)
    const blockFriend = async () => {
      try {
        await axios.put(`${backend}/user/block?id=${prop}`, {}, {
          headers: {
            Authorization: `bearer ${Cookies.get('jwt')}`
          }
        })
      }
      catch (err) {
        console.error(prop)
      }
    }
    return <div>
        <button className={styles.PlayButton} onClick={blockFriend}> Block </button>
    </div>
}

export default BlockFriend