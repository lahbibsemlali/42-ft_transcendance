import styles from "./GameStatus.module.css"

function GameStatus(){
    return <div className={styles.status}>
            <h1> 00 : 00 </h1>
            <img src="/Avatar.jpeg" alt="player's avatar (last games)" className={styles.statusAvatar}/>
            <img src="/Avatar.jpeg" alt="player's avatar (last games)" className={styles.statusAvatarTwo}/>
    </div>
}

export default GameStatus