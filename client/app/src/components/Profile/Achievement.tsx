import { useEffect, useState } from "react"
import Styles from "./Achievement.module.css"
import Achievement_Box from "./Achievement_Box"
import axios from "axios"
import Cookies from "js-cookie"
const backend = `http://${import.meta.env.VITE_DOMAIN}:8000/api`

function Achievement({prop}: {prop: any}){
    const [wins, setWins] = useState(0)

    useEffect(() => {
        const fetcher = async () => {
            try {
                const res = await axios(`${backend}/user/getFriendProfile?id=${prop}`, {
                    headers: {
                        Authorization: `bearer ${Cookies.get('jwt')}`
                    }
                })
                setWins(res.data.wins)
            }
            catch (err) {
            }
        }
        fetcher()
    }, [])
    return <div className={Styles.boxA}>
        <h1>Achievement</h1>
            {wins > 0 && <Achievement_Box title={"Won One Game"} image={"/OneGame.png"}/>}
            {wins >= 5 && <Achievement_Box  title={"Won Five Games"} image={"/FiveGames.png"}/>}
            {wins >= 10 && <Achievement_Box  title={"Won Ten Games"} image={"/TenGames.png"}/>}
            {wins >= 20 && <Achievement_Box  title={"Won Twenty Games"} image={"/TwentyGames.png"}/>}
    </div>
}

export default Achievement
