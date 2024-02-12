import styles from "./Overview.module.css"

function Overview(){
    return <div className={styles.smallbox}>
        <h1 className={styles.over}> OVERVIEW </h1>
        <div className={styles.middleBorder}></div>
        <div>
            <h2 className={styles.textW}> WINS </h2>
            <p className={styles.wins}>0000</p>
        </div>
        <div>
            <h2 className={styles.textL}> LOSSES </h2>
            <p className={styles.losses}>0000</p>
        </div>
    </div>
}

export default Overview