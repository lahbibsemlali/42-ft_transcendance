import Styles from "./Achievement.module.css"
// import Achievement_Box from "./Achievement_Box"
import Achievement_Box from "./Achievement_Box"


function Achievement(){
    return <div className={Styles.boxA}>
        <h1>Achievement</h1>
            <Achievement_Box title={"Won One Game"} image={"/OneGame.png"}/>
            <Achievement_Box  title={"Won Five Games"} image={"/FiveGames.png"}/>
            <Achievement_Box  title={"Won Ten Games"} image={"/TenGames.png"}/>
            <Achievement_Box  title={"Won Twenty Games"} image={"/TwentyGames.png"}/>
    </div>
}

export default Achievement
