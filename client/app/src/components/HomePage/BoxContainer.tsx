import Achievement from "./Achievement"
import Styles from "./BoxContainer.module.css"
import LastGames from "./LastGames"
import PlayerCard from "./PlayerCard"

function BoxContainer(){
    return <div className={Styles.container}>
        <div><PlayerCard/></div>
        <div><Achievement/></div>
        <div><LastGames/></div>
    </div>
}

export default BoxContainer