import { useSelector } from "react-redux";
import { selectUser } from "../redux/user/userSlice";
import { Navigate } from "react-router-dom";
import NavBar from "../components/NavBar/NavBar";
import HeaderAuth from "../components/HeaderAuth/HeaderAuth";
import { selectMenuOpened } from "../redux/ui/uiSlice";
import clsx from "clsx";
import styles from "./Page.module.scss";

const RequireAuth = ({ children }) => {
  const user = useSelector(selectUser);
  const menuOpened = useSelector(selectMenuOpened);

  if (!user) {
    return <Navigate replace to="/login" />;
  }

  return (
    <div
      className={clsx("container", "flex-wrapper", {
        [styles.fixed]: menuOpened,
      })}
    >
      <NavBar />
      <div className="page-content">
        <HeaderAuth />
        {children}
      </div>
    </div>
  );
};

export default RequireAuth;
