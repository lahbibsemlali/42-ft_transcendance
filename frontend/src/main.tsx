import axios from 'axios'
import ReactDOM from 'react-dom/client'

let user = {}
ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <h1>hello lmaghreb</h1>
    <button onClick={async () => {
      user = await axios.get('http://localhost:3000/auth/42')
    }}>{JSON.stringify(user)}</button>
  </>
)
