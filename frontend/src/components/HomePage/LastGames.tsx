// import GameStatus from "./GameStatus";
import GameStatus from "./GameStatus";
import Styles from "./LastGames.module.css";

function LastGames() {
  return (
    <div className={Styles.last}>
      <h1>Last Games</h1>
      <GameStatus />
      <GameStatus />
      <GameStatus />
      <GameStatus />
      <GameStatus />
    </div>
  );
}

export default LastGames;
