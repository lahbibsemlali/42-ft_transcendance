import { isLogin, reCheck } from "../Authorization/Authorization";
import { useContext, useEffect } from "react";
import LoginPage from "../LoginPage/LoginPage";
import Header from "../Header/Header";
import styles from "../SettingsPage/SettingsPage.module.css";
import "./Friends.css";

type Props = {};

const Friends = (props: Props) => {
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

  if (isLoggedIn == 2) return <LoginPage />;

  return (
    <div>
      <Header />
      <div className="FContainer">
        <div className="box">
          <div className="friends">
            <div className="friendstext">
              <h4>Friends</h4>
              <hr style={{ color: "white" }} />
            </div>
            <div
              className="friendList"
              style={{
                backgroundColor: "green",
                width: "100%",
                height: "85%",
              }}
            ></div>
          </div>
          <div className="pending">
            <div className="pendingtext">
              <h4>Friends</h4>
              <hr style={{ color: "white" }} />
            </div>
            <div
              className="pendingList"
              style={{
                backgroundColor: "yellow",
                width: "100%",
                height: "85%",
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Friends;
