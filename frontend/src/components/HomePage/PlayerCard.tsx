import Overview from "./Overview.tsx";
import Play from "./Play.tsx";
import styles from "./PlayerCard.module.css";

function PlayerCard() {
  return (
    <div className={styles.Player}>
      <h1 className={styles.more}>Player Card</h1>
      <img src="/Avatar.jpeg" alt="Player's avatar" className={styles.avatar} />
      <Overview />
      <h2 className={styles.playText}>New Game </h2>
      <Play />
    </div>
  );
}

export default PlayerCard;
