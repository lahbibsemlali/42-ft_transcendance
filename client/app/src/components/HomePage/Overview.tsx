import { useEffect, useState } from "react"
import styles from "./Overview.module.css"
import axios from "axios"
import Cookies from "js-cookie"

function Overview(){
    const [wins, setWins] = useState(0)
    const [loses, setLoses] = useState(0)

    useEffect(() => {
        const fetcher = async () => {
            const res = await axios(`http://${import.meta.env.VITE_DOMAIN}:8000/api/user/getUserData`, {
                headers: {
                    Authorization: `bearer ${Cookies.get('jwt')}`
                }
            })
            setWins(res.data.wins)
            setLoses(res.data.loses)
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