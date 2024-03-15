import { useEffect, useState } from "react";
import Header from "../Header/Header";
import styles from "./FriendsList.module.css"
import axios from "axios";
import Cookies from "js-cookie"

function FriendsList(){
    const[Friends, setFriends] = useState([]);
    const[requests, setRequests] = useState([]);
    const[blocked, setBlocked] = useState([]);
    const[changed, setChanged] = useState(false);
    
    useEffect(() => {
        const fetcher = async () => {
            try {
                const res = await axios(`http://${import.meta.env.VITE_DOMAIN}:8000/api/user/getFriendList`, {
                    headers: {
                        Authorization: `bearer ${Cookies.get('jwt')}`
                    }
                })
                setFriends(() => res.data.friends);
                const res2 = await axios(`http://${import.meta.env.VITE_DOMAIN}:8000/api/user/getFriendRequests`, {
                    headers: {
                        Authorization: `bearer ${Cookies.get('jwt')}`
                    }
                })
                setRequests(() => res2.data.requests)
                const res3 = await axios(`http://${import.meta.env.VITE_DOMAIN}:8000/api/user/getBlockedFriends`, {
                    headers: {
                        Authorization: `bearer ${Cookies.get('jwt')}`
                    }
                })
                setBlocked(() => res3.data.blocked)
            } catch (err) {
            }
        }
        fetcher()
        setChanged(() => false)
    }, [changed])

    const acceptFriend = async (id: number) => {
        try {
          await axios(`http://${import.meta.env.VITE_DOMAIN}:8000/api/user/accept_friend?id=${id}`, {
            headers: {
              Authorization: `bearer ${Cookies.get('jwt')}`
            }
          })
        }
        catch (err) {
        }
        setChanged(() => true)
    }

    const removeFriend = async (index: number) =>{
        try {
            await axios(`http://${import.meta.env.VITE_DOMAIN}:8000/api/user/remove_friend?id=${index}`, {
                headers: {
                    Authorization: `bearer ${Cookies.get('jwt')}`
                }                
            })
        }
        catch (err) {}
        setChanged(() => true)
    }

    const unblockFriend = async (index: any) =>{
        try {
            await axios.put(`http://${import.meta.env.VITE_DOMAIN}:8000/api/user/unBlock?id=${index}`, {}, {
                headers: {
                    Authorization: `bearer ${Cookies.get('jwt')}`
                }                
            })
        }
        catch (err) {}
        setChanged(() => true)
    }
    return(
        <div>
            <Header />
            <div className={styles.containerList}>
                <div>
                    <ul className={styles.listul}>
                        <h1>Friends List </h1>
                        {Friends.length < 1 ? (
                            <p>No friends found yet 🚫👥</p>
                        ) :
                        Friends.map((Friend: any, index) => (
                            <li key={index}>
                                <span >{index + 1}</span>
                                <span>{Friend.username}</span>
                                <img src={Friend.avatar} className={styles.friendImg}/>
                                <button onClick={() => removeFriend(Friend.id)} className={styles.removeButton}>Remove</button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <ul className={styles.blockBox}>
                        <h1>Blocked Friends </h1>
                        {blocked.length < 1 ? (
                            <p>No blocked friends 🚫👥</p>
                        ) :
                        blocked.map((Friend: any, index) => (
                            <li key={index}>
                                <span >{index + 1}</span>
                                <span>{Friend.username}</span>
                                <img src={Friend.avatar} className={styles.friendImg}/>
                                <button onClick={() => unblockFriend(Friend.id)} style={{backgroundColor:"#023e8a"}}>Unblock</button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <ul className={styles.requestBox}>
                        <h1>Friends Requests</h1>
                        {requests.length < 1 ? (
                            <p>No friend requests 🚫👥</p>
                        ) :
                        requests.map((friend: any) => (
                            <li>
                                <img src={friend.avatar} className={styles.friendImg}/>
                                <span>{friend.username}</span>
                                <button className={styles.buttonAccept} onClick={() => acceptFriend(friend.id)}>Accept</button>
                                <button  className={styles.buttonIgnore} onClick={() => removeFriend(friend.id)}>Ignore</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}


export default FriendsList