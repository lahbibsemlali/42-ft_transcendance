import axios from 'axios';
import Cookies from 'js-cookie';
import { useEffect, useState } from "react"
import styles from "./Qr.module.css"
import toast from "react-hot-toast";

function Qr({ setChanged }: any){
    let [qrUrl, setQrUrl] = useState('')
    let [input, setInput] = useState('')
    const notify = (msg: string) => toast.error(msg);

    useEffect(() => {
        const fetcher = async () => {
            const res = await axios(`http://${import.meta.env.VITE_DOMAIN}:8000/api/2fa/generate`, {
                headers: {
                Authorization: `bearer ${Cookies.get('jwt')}`
                }
            })
            setQrUrl(() => res.data.qrUrl)
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
        }
        catch (err: any) {
            notify(err.response.data.message)
        }
    }
    return (
        <div className={styles.qrBox}>
            <img src={qrUrl}></img>
            <div>
                <span> Two-Factor Verification </span>
                <p> Please scan and enter 2FA code </p>
            </div>
            <div className={styles.codeInput}>
            <input placeholder="" type="text" maxLength={6} onChange={e => setInput(() => e.target.value)}/>
            </div>
            <button className={styles.Pass_verify} onClick={checkToken}>Verify</button>
        </div>
    );
}

export default Qr