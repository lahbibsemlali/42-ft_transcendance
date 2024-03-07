import { useEffect, useState } from "react"
// import Achievement_Box from "./Achievement_Box"
import axios from "axios"
import Cookies from "js-cookie"
import GameStatus from "./GameStatus";
import Styles from "./LastGames.module.css";
const backend = `http://${import.meta.env.VITE_DOMAIN}:8000/api`

function LastGames(prop: any) {
  const [lastFive, setLastFive] = useState<{}>([])

  useEffect(() => {
    const fetcher = async () => {
      const res = await axios(`${backend}/user/getFriendProfile?id=${prop}`, {
        headers: {
                Authorization: `bearer ${Cookies.get('jwt')}`
            }
        })
        console.log(res.data, '====')
        setLastFive(() => res.data.lastFive)
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
