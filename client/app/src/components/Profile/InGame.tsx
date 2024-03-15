import styles from './InGame.module.css';

function InGame() {
    return (
        <>
            <div className={styles.online}>
                <span className={styles.blink}></span>
            </div>
        </>
    );
  }
  
  export default InGame;
  