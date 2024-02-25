import { isLogin, reCheck } from "../Authorization/Authorization";
import { MutableRefObject, useContext, useEffect, useRef, useState } from "react";
import LoginPage from "../LoginPage/LoginPage";
import Header from "../Header/Header";
import styles from "./SettingsPage.module.css"
import axios from "axios";
import Cookies from "js-cookie";

const SettingsPage = () => {
  const isLoggedIn = useContext(isLogin);
  const context = useContext(reCheck);
  if (!context || !context.setCheck) {
    return;
  }
  
  useEffect(() => {
    axios(`http://${import.meta.env.VITE_DOMAIN}:8000/api/user/getUsername`, {
      headers: {
        Authorization: `bearer ${Cookies.get('jwt')}`
      }
    })
    .then((res) => setLabel(() => res.data.username))
    .then(() => console.log("=-=-=", username))
    axios(`http://${import.meta.env.VITE_DOMAIN}:8000/api/user/getAvatarUrl`, {
      headers: {
        Authorization: `bearer ${Cookies.get('jwt')}`
      }
    })
    .then((res) => setAvatarUrl(() => res.data.avatar))
    .then(() => console.log("+-+-+", avatarUrl))
  }, [])
  
  let [avatarUrl, setAvatarUrl] = useState('')
  let [username, setUsername] = useState('')
  let [avatar, setAvatar] = useState()
  let [label, setLabel] = useState('')

  const updateAvatar = async (file: string) => {
    const formData = new FormData;

    formData.append('file', file)
    console.log("file", file)
    try {
      await axios.post(`http://${import.meta.env.VITE_DOMAIN}:8000/api/user/updateAvatar`, formData, {
        headers: {
          Authorization: `Bearer ${Cookies.get('jwt')}`
        }
      })
      const res = await axios(`http://${import.meta.env.VITE_DOMAIN}:8000/api/user/getAvatarUrl`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('jwt')}`
        }
      })
      setAvatarUrl(() => res.data.avatar)
      console.log(avatar)
    } catch (err) {
      console.log(err)
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
      console.log(res)
      setLabel(username)
    } catch (err) {
      console.log(err)
    }
  }

  const updateInfo = async () => {
    if (username.length)
      await changeUsername(username)
    if (avatar)
      await updateAvatar(avatar)
  }

  const stateUsername = (e: any) => {
    e.preventDefault();
    setUsername(() => e.target.value);
  }

  const stateAvatar = (e: any) => {
    e.preventDefault();
    setAvatar(() => e.target.files[0]);
  }
  
  if (isLoggedIn == 2) return <LoginPage />;
  
  console.log(username, '----------------------')
  return (
    <div>
      <Header />
      <div className={styles.Profile}>
        <div className={styles.Sbox}>
          <img src={avatarUrl} alt="Player's avatar" className={styles.Savatar}/>
          <label>Upload image
            <input name="myImage" type="file" accept="image/*" onChange={stateAvatar}/>
          </label>
          {/* <button className={styles.Sbox_button1}>Edit Picture </button > */}
          <input placeholder={label} type="text" className={styles.Sbox_input1} onChange={stateUsername}/>
          <h1> TWO FACTOR AUTHENTICATION </h1>
          <input placeholder="ACTIVATE" type="text" className={styles.Sbox_input2}/>
          <button className={styles.Sbox_button2} onClick={updateInfo}> UPDATE </button>
        </div> 
      </div>
    </div>
  );
};

export default SettingsPage;
