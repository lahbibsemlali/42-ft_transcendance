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
          // console.log(res.data)
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
      // console.log("file", file)
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
        // console.log(avatar)
      } catch (err) {
        // console.log(err)
      }
    }
  
    const changeUsername = async (username: string) => {
      const jsonFormat = {
        username: username
      };
  
      try {
        // console.log("+++++++++++", username)
        const res = await axios.post(`http://${import.meta.env.VITE_DOMAIN}:8000/api/user/updateUsername`, jsonFormat, {
          headers: {
            Authorization: `Bearer ${Cookies.get('jwt')}`
          }
        })
        // console.log(res)
        setLabel(username)
        setUsername(() => '')

      } catch (err: any) {
        // console.log('hola error: ', err.response.data)
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
        // console.log('res is ', res)
      } catch (err) {
        // console.log(err)
      }
    }
    
    const updateInfo = async () => {
      // console.log(avatar)
      if (username.length)
        await changeUsername(username)
      if (avatar)
        await updateAvatar(avatar)
      await updateTwoFa()
    }
  
    const stateUsername = (e: any) => {
      // console.log(username)
      e.preventDefault();
      setUsername(() => e.target.value);
    }
  
    const stateAvatar = (e: any) => {
      e.preventDefault();
      setAvatar(() => e.target.files[0]);
    }
    
    const stateTwoFa = (e: any) => {
      // e.preventDefault();
      // console.log("2fa ", e.target.value)
      setTwoFa((pref) => !pref);
      // e.target.value = 'off'
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
        {/* <button className={styles.Sbox_button1}>Edit Picture </button > */}
        <input placeholder={label} type="text" className={styles.Sbox_input1} onChange={stateUsername} value={username}/>
        <h1> TWO FACTOR AUTHENTICATION </h1>
        <input className={styles.toggle} type="checkbox" onChange={stateTwoFa} checked={twoFa}/>
        <button className={styles.Sbox_button2} type='button' onClick={updateInfo}> UPDATE </button>
    </>
    )
}

export default StCenter