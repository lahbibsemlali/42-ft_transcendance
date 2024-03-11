import { useEffect, useState } from "react";
import Header from "../Header/Header";
import styles from "./FriendsList.module.css"
import axios from "axios";
import Cookies from "js-cookie"

function FriendsList(){
    const[Friends, setFriends] = useState([]);
    const[requests, setRequests] = useState([]);
    const[blocked, setBlocked] = useState([]);

    useEffect(() => {
        const fetcher = async () => {
            const res = await axios(`http://${import.meta.env.VITE_DOMAIN}:8000/api/user/getFriendList`, {
                headers: {
                    Authorization: `bearer ${Cookies.get('jwt')}`
                }
            })
            setFriends(res.data.friends);
            const res2 = await axios(`http://${import.meta.env.VITE_DOMAIN}:8000/api/user/getFriendRequests`, {
                headers: {
                    Authorization: `bearer ${Cookies.get('jwt')}`
                }
            })
            setRequests(res2.data.requests)
            const res3 = await axios(`http://${import.meta.env.VITE_DOMAIN}:8000/api/user/getBlockedFriends`, {
                headers: {
                    Authorization: `bearer ${Cookies.get('jwt')}`
                }
            })
            console.log(res3.data.blocked)
            setBlocked(res3.data.blocked)
        }
        fetcher()
    }, [])
    const removeFriend = async (index: any) =>{
        try {
            await axios(`http://${import.meta.env.VITE_DOMAIN}:8000/api/user/remove_friend?friendId=${index}`, {
                headers: {
                    Authorization: `bearer ${Cookies.get('jwt')}`
                }                
            })
        }
        catch (err) {}
    }
    const unblockFriend = async (index: any) =>{
        try {
            await axios.put(`http://${import.meta.env.VITE_DOMAIN}:8000/api/user/unBlock?friendId=${index}`, {}, {
                headers: {
                    Authorization: `bearer ${Cookies.get('jwt')}`
                }                
            })
        }
        catch (err) {}
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
                            <p>No friends found yet 🚫👥</p>
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
                        requests.map((request: any) => (
                            <li>
                                <img src={request.avatar} className={styles.friendImg}/>
                                <span>{request.username}</span>
                                <button className={styles.buttonAccept}>Accept</button>
                                <button  className={styles.buttonIgnore}>Ignore</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}


export default FriendsList