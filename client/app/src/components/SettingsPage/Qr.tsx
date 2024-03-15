import axios from 'axios';
// import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import { Navigate } from 'react-router-dom';

// const Qr = () => {
//     let [qrUrl, setQrUrl] = useState('')

//     useEffect(() => {
//         let fetcher = async () => {
//         await axios(`http://${import.meta.env.VITE_DOMAIN}:8000/api/2fa/generate`, {
//             headers: {
//             Authorization: `bearer ${Cookies.get('jwt')}`
//             }
//         })
//         .then((res) => {
//             // //console.log("qrcode:??", res.data.qrUrl)
//             setQrUrl(() => res.data.qrUrl)
//             // setAvatarUrl(() => res.data.qrUrl)
//             return res
//         })
//         }
//         fetcher();
//     }, [])
//     // //console.log('url qr ar: ', qrUrl)
//     return (
//     <>
//         <img src={qrUrl}></img>
//         <input type='text'></input>
//     </>
//     )
// }

// export default Qr



import { useEffect, useState } from "react"
import styles from "./Qr.module.css"

function Qr({ setChanged }: any){
    let [qrUrl, setQrUrl] = useState('')
    let [input, setInput] = useState('')
    const [goodToken, setGoodToken] = useState(false)

    useEffect(() => {
        const fetcher = async () => {
            const res = await axios(`http://${import.meta.env.VITE_DOMAIN}:8000/api/2fa/generate`, {
                headers: {
                Authorization: `bearer ${Cookies.get('jwt')}`
                }
            })
            // //console.log("qrcode:??", res.data.qrUrl)
            setQrUrl(() => res.data.qrUrl)
            // setAvatarUrl(() => res.data.qrUrl)
        }
        fetcher();
    }, [])

    const checkToken = async () => {
        try {
            await axios.post(`http://${import.meta.env.VITE_DOMAIN}:8000/api/2fa/turn-on`, {token: input}, {
                headers: {
                    Authorization: `bearer ${Cookies.get('jwt')}`
                }
            })
            setChanged(false)
            // //console.log('soo good')
        }
        catch (err) {
            // //console.log('not good', err)
        }
    }
    return (
        <div className={styles.fo}>
            <img src={qrUrl}></img>
            <div>
                <span> Two-Factor Verification </span>
                <p> Please scan and enter 2FA code </p>
            </div>
            <div className={styles.codeInput}>
            <input placeholder="" type="text" maxLength={6} onChange={e => setInput(() => parseInt(e.target.value))}/>
            </div>
            <button className={styles.Pass_verify} onClick={checkToken}>Verify</button>
        </div>
    );
}

export default Qr