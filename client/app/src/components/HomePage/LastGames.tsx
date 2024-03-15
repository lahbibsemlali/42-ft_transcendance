import { useEffect, useState } from "react"
import axios from "axios"
import Cookies from "js-cookie"
import GameStatus from "./GameStatus";
import Styles from "./LastGames.module.css";

function LastGames() {
  const [lastFive, setLastFive] = useState<{}>([])

  useEffect(() => {
    const fetcher = async () => {
        const res = await axios(`http://${import.meta.env.VITE_DOMAIN}:8000/api/user/getLastFive`, {
            headers: {
                Authorization: `bearer ${Cookies.get('jwt')}`
            }
        })
        setLastFive(() => res.data.lastFive)
    }
    fetcher()
}, [])
  return (
    <div className={Styles.last}>
      <h1>Last Games</h1>
      {lastFive.map(game => <GameStatus {...game}/>)}
    </div>
  );
}

export default LastGames;
