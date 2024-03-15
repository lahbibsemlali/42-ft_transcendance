import styles from "./GameStatus.module.css"

function GameStatus(props: any){
    return <div className={styles.status}>
            <h1> {props.result} </h1>
            <img src={props.pic1} alt="player's avatar (last games)" className={styles.statusAvatar}/>
            <img src={props.pic2} alt="player's avatar (last games)" className={styles.statusAvatarTwo}/>
    </div>
}

export default GameStatus