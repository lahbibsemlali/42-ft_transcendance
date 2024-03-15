import { useEffect, useState } from "react"
import axios from "axios"
import Cookies from "js-cookie"
import GameStatus from "./GameStatus";
import Styles from "./LastGames.module.css";
const backend = `http://${import.meta.env.VITE_DOMAIN}:8000/api`

function LastGames({prop}: {prop: any}) {
  const [lastFive, setLastFive] = useState<{}>([])

  useEffect(() => {
    const fetcher = async () => {
      try {
        const res = await axios(`${backend}/user/getUserLastFive?id=${prop}`, {
          headers: {
                  Authorization: `bearer ${Cookies.get('jwt')}`
              }
          })
          setLastFive(() => res.data.lastFive)
      } catch (err) {
      }
    }
    fetcher()
}, [])
  return (
    <div className={Styles.last}>
      <h1>Last Games</h1>
      {lastFive.map((game: any) => <GameStatus {...game}/>)}
    </div>
  );
}

export default LastGames;
