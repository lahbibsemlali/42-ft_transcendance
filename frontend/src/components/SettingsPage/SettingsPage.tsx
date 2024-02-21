import { isLogin, reCheck } from "../Authorization/Authorization";
import { useContext, useEffect, useState } from "react";
import LoginPage from "../LoginPage/LoginPage";
import Header from "../Header/Header";
import styles from "./SettingsPage.module.css"
import axios from "axios";
import useSWR from "swr";
import Cookies from "js-cookie";

const SettingsPage = () => {
  const isLoggedIn = useContext(isLogin);
  const context = useContext(reCheck);
  if (!context || !context.setCheck) {
    return;
  }
  const { check, setCheck } = context;

  useEffect(() => {
    if (check) setCheck(false);
    else setCheck(true);
  }, []);

  const uploadToBackend = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('image', e.target.files[0])
    console.log(data, "++++++++++", e.target.files[0])

    try {
      const res = await axios.post('http://localhost:3000/user/upload_avatar', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: "Bearer " + Cookies.get('jwt')
        }
      })
    } catch (err) {
      console.log('failed____________________++', err)
    }
  }

  const fetcher = (url: string) =>
    axios
      .get(url, { headers: { Authorization: "Bearer " + Cookies.get('jwt') }, responseType: 'blob' })
      .then((res) => {
        let imageUrl = URL.createObjectURL(res.data)
        console.log(imageUrl, "================")
        return imageUrl
      });
  const { data } = useSWR('http://localhost:3000/user/getAvatar', fetcher)

  console.log( "-----------------", data )
  if (isLoggedIn == 2) return <LoginPage />;

  return (
    <div>
      <Header />
      <div className={styles.Profile}>
        <div className={styles.Sbox}>
          <img src={data} alt="Player's avatar" className={styles.Savatar}/>
      <label className={styles.Sbox_button1} htmlFor="pic">
        <span>Click To Upload File ;D</span>
        <input type="file" id="pic" onChange={uploadToBackend}/>
      </label>


          {/* <input className={styles.Sbox_button1} type='file'/> */}
          <input placeholder=" USERNAME " type="text" className={styles.Sbox_input1}/>
          <h1> TWO FACTOR AUTHENTICATION </h1>
          <input placeholder="ACTIVATE" type="text" className={styles.Sbox_input2}/>
          <button className={styles.Sbox_button2}> UPDATE </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
