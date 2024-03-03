import Header from "../Header/Header";
import styles from "./FriendsList.module.css"

function FriendsList(){
    return(
        <div>
            <Header />
            <div>
                <ul className={styles.listul}>
                    <h1>Friends List </h1>
                    <li>
                        <span >1</span>
                        <span>Name</span>
                    </li>
                    <li>
                        <span>2</span>
                        <span>Name</span>
                    </li>
                    <li>
                        <span>3</span>
                        <span>Name</span>
                    </li>
                    <li>
                        <span>4</span>
                        <span>Name</span>
                    </li>
                    <li>
                        <span>5</span>
                        <span>Name</span>
                    </li>
                    <li>
                        <span>6</span>
                        <span>Name</span>
                    </li>
                </ul>
                <div>
                    <h1></h1>
                </div>
            </div>
        </div>
    );
}


export default FriendsList