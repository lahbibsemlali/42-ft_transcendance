import styles from "./Achievement_Box.module.css"

function Achievement_Box({title, image}){
    return <div className={styles.AchBox}>
        <img src={image} alt="Achievement image" className={styles.AchImg}/>
        <p>{title}</p>
    </div>
}

export default Achievement_Box