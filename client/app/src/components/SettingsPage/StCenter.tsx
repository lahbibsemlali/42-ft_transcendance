import React, { useEffect, useState } from 'react';
import styles from "./SettingsPage.module.css";
import axios from 'axios';
import Cookies from 'js-cookie';
import Qr from './Qr';
import toast from 'react-hot-toast';

const StCenter = () => {
    let [avatarUrl, setAvatarUrl] = useState('')
    let [username, setUsername] = useState('')
    let [avatar, setAvatar] = useState(null)
    let [label, setLabel] = useState('')
    let [twoFa, setTwoFa] = useState(false)
    let [changed, setChanged] = useState(false)

    const notify = (msg: string) => toast.error(msg);

    useEffect(() => {
      let fetcher = async () => {
        await axios(`http://${import.meta.env.VITE_DOMAIN}:8000/api/user/getUserData`, {
          headers: {
            Authorization: `bearer ${Cookies.get('jwt')}`
          }
        })
        .then((res) => {
          setLabel(() => res.data.username)
          setAvatarUrl(() => res.data.avatar)
          setTwoFa(() => res.data.isTwoFa)
          return res
        })
      }
      fetcher();
    }, [])
    
  
    const updateAvatar = async (file: string) => {
      const formData = new FormData;
  
      formData.append('file', file)
      try {
        await axios.post(`http://${import.meta.env.VITE_DOMAIN}:8000/api/user/updateAvatar`, formData, {
          headers: {
            Authorization: `Bearer ${Cookies.get('jwt')}`
          }
        })
        const res = await axios(`http://${import.meta.env.VITE_DOMAIN}:8000/api/user/getUserData`, {
          headers: {
            Authorization: `Bearer ${Cookies.get('jwt')}`
          }
        })
        setAvatarUrl(() => res.data.avatar)
        setAvatar(null)
      } catch (err) {
      }
    }
  
    const changeUsername = async (username: string) => {
      const jsonFormat = {
        username: username
      };
  
      try {
        const res = await axios.post(`http://${import.meta.env.VITE_DOMAIN}:8000/api/user/updateUsername`, jsonFormat, {
          headers: {
            Authorization: `Bearer ${Cookies.get('jwt')}`
          }
        })
        setLabel(username)
        setUsername(() => '')

      } catch (err: any) {
        notify(err.response.data.message)
      }
    }
  
    const updateTwoFa = async () => {
      const jsonFormat = {
        twoFa: twoFa
      };
  
      try {
        let res = await axios(`http://${import.meta.env.VITE_DOMAIN}:8000/api/user/getUserData`, {
          headers: {
            Authorization: `Bearer ${Cookies.get('jwt')}`
          }
        })
        if (twoFa && !res.data.isTwoFa)
          setChanged(() => true)
        if (res.data.isTwoFa) {
          res = await axios.post(`http://${import.meta.env.VITE_DOMAIN}:8000/api/user/updateTwoFa`, jsonFormat, {
            headers: {
              Authorization: `Bearer ${Cookies.get('jwt')}`
            }
          })
        }
      } catch (err) {
      }
    }
    
    const updateInfo = async () => {
      if (username.length)
        await changeUsername(username)
      if (avatar)
        await updateAvatar(avatar)
      await updateTwoFa()
    }
  
    const stateUsername = (e: any) => {
      e.preventDefault();
      setUsername(() => e.target.value);
    }
  
    const stateAvatar = (e: any) => {
      e.preventDefault();
      setAvatar(() => e.target.files[0]);
    }
    
    const stateTwoFa = (e: any) => {
      setTwoFa((pref) => !pref);
    }

    if (changed) {
      return <Qr setChanged={setChanged}/>
    }
  return (
    <>
        <img src={avatarUrl} alt="Player's avatar" className={styles.Savatar}/>
        <label>Change Avatar
          <input className={styles.Sbox_button1} name="myImage" type="file" accept="image/*" onChange={stateAvatar}/>
        </label>
        <input placeholder={label} type="text" className={styles.Sbox_input1} onChange={stateUsername} value={username}/>
        <h1> TWO FACTOR AUTHENTICATION </h1>
        <input className={styles.toggle} type="checkbox" onChange={stateTwoFa} checked={twoFa}/>
        <button className={styles.Sbox_button2} type='button' onClick={updateInfo}> UPDATE </button>
    </>
    )
}

export default StCenter