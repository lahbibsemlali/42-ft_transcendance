import Achievement from "./Achievement"
import Styles from "./BoxContainer.module.css"
import LastGames from "./LastGames"
import PlayerCard from "./PlayerCard"
import ProfileCard from "./ProfileCard"

function BoxContainer({prop}: {prop: any}){
    return <div className={Styles.container}>
        <div><ProfileCard prop={prop}/></div>
        <div><Achievement prop={prop}/></div>
        <div><LastGames prop={prop}/></div>
    </div>
}

export default BoxContainer