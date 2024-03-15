import { useEffect, useState } from "react"
import styles from "./Overview.module.css"
import axios from "axios"
import Cookies from "js-cookie"
const backend = `http://${import.meta.env.VITE_DOMAIN}:8000/api`

function Overview({prop}: any){
    const [wins, setWins] = useState(0)
    const [loses, setLoses] = useState(0)

    useEffect(() => {
        const fetcher = async () => {
            try {
                const res = await axios(`${backend}/user/getFriendProfile?id=${prop}`, {
                    headers: {
                        Authorization: `bearer ${Cookies.get('jwt')}`
                    }
                })
                setWins(res.data.wins)
                setLoses(res.data.loses)
            }
            catch (err) {
            }
        }
        fetcher()
    }, [])
    return <div className={styles.smallbox}>
        <h1 className={styles.over}> OVERVIEW </h1>
        <div className={styles.middleBorder}></div>
        <div>
            <h2 className={styles.textW}> WINS </h2>
            <p className={styles.wins}>{wins}</p>
        </div>
        <div>
            <h2 className={styles.textL}> LOSSES </h2>
            <p className={styles.losses}>{loses}</p>
        </div>
    </div>
}

export default Overview