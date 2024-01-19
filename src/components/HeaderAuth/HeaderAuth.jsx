import styles from "./HeaderAuth.module.scss";
import Button from "../Button/Button";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { logout, selectUser } from "../../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "../Icons/LogoutIcon";
import BurgerButton from "../BurgerButton/BurgerButton";
import { selectMenuOpened, toggleMenu } from "../../redux/ui/uiSlice";
import clsx from "clsx";

const HeaderAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const menuOpened = useSelector(selectMenuOpened);

  const handleClick = () => {
    signOut(auth).then(() => {
      dispatch(logout());
      navigate("/");
    });
  };

  return (
    <header className={styles.header}>
      <BurgerButton
        className={clsx(styles.burger, { [styles.opened]: menuOpened })}
        checked={menuOpened}
        onClick={() => dispatch(toggleMenu())}
      />
      <div className={styles.greeting}>
        <h3 className={styles.greeting__header}>Hello, {user.name}!</h3>
        <div className={styles.greeting__text}>
          Let`s plan your meal for today!
        </div>
      </div>
      <Button
        className={styles.button}
        onClick={handleClick}
        icon={<LogoutIcon />}
      >
        Log Out
      </Button>
    </header>
  );
};

export default HeaderAuth;
