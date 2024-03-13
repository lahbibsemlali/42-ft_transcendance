import styles from './Offline.module.css';

function Offline() {
    return (
        <>
            <div className={styles.online}>
                <span className={styles.blink}></span>
            </div>
        </>
    );
  }
  
  export default Offline;
  