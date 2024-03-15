import { useEffect, useState } from "react"
import Styles from "./Achievement.module.css"
import Achievement_Box from "./Achievement_Box"
import axios from "axios"
import Cookies from "js-cookie"

function Achievement(){
    const [wins, setWins] = useState(0)

    useEffect(() => {
        const fetcher = async () => {
            const res = await axios(`http://${import.meta.env.VITE_DOMAIN}:8000/api/user/getUserData`, {
                headers: {
                    Authorization: `bearer ${Cookies.get('jwt')}`
                }
            })
            setWins(res.data.wins)
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
