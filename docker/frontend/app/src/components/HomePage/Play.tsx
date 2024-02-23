import { Link } from "react-router-dom"
import styles from "./Play.module.css"

function Play(){
    return <div>
        <Link to="Game"> <button className={styles.PlayButton}> Play Now </button></Link>
    </div>
}

export default Play