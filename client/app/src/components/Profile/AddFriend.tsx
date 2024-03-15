import styles from "./AddFriend.module.css"
const backend = `http://${import.meta.env.VITE_DOMAIN}:8000/api`
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

function AddFriend({prop}: {prop: string}){
    const [status, setStatus] = useState(0)
    const [changed, setChanged] = useState(false)
    useEffect(() => {
      const fetcher = async () => {
        try {
            const res = await axios(`${backend}/user/getFriendStatus?id=${prop}`, {
              headers: {
                Authorization: `bearer ${Cookies.get('jwt')}`
              }
            })
            setStatus(res.data.status)
          }
          catch (err) {
          }
      }
      fetcher()
      setChanged(() => false)
    }, [changed])

    const addFriend = async () => {
      try {
        await axios(`${backend}/user/add_friend?id=${prop}`, {
          headers: {
            Authorization: `bearer ${Cookies.get('jwt')}`
          }
        })
      }
      catch (err) {
        console.error(prop)
      }
      setChanged(() => true)

    }

    const acceptFriend = async () => {
      try {
        await axios(`${backend}/user/accept_friend?id=${prop}`, {
          headers: {
            Authorization: `bearer ${Cookies.get('jwt')}`
          }
        })
      }
      catch (err) {
        console.error(prop)
      }
      setChanged(() => true)

    }

    const RemoveFriend = async () => {
      try {
        await axios(`${backend}/user/remove_friend?id=${prop}`, {
          headers: {
            Authorization: `bearer ${Cookies.get('jwt')}`
          }
        })
      }
      catch (err) {
        console.error(prop)
      }
      setChanged(() => true)
    }

    const handleFriendship = () => {
      if (status != 1)
        status == 0 ? addFriend() : status == 2 ? acceptFriend() : RemoveFriend(); 
    }
    return (
      <div>
        <button className={styles.PlayButton} onClick={handleFriendship}> {status == 0 ? "Add Friend" : status == 1 ? "Pending" : status == 2 ? "Accept As Friend" : "Remove"} </button>
      </div>
      )
}

export default AddFriend