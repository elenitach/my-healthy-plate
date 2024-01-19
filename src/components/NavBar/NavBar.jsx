import { Link } from "react-router-dom";
import NavBarItem from "../NavBarItem/NavBarItem";
import styles from "./Navbar.module.scss";
import OverviewIcon from "../Icons/OverviewIcon";
import RecipesIcon from "../Icons/RecipesIcon";
import SettingsIcon from "../Icons/SettingsIcon";
import { useDispatch, useSelector } from "react-redux";
import { selectMenuOpened, toggleMenu } from "../../redux/ui/uiSlice";
import clsx from "clsx";

const NavBar = () => {
  const dispatch = useDispatch();
  const menuOpened = useSelector(selectMenuOpened);

  const handleClick = () => {
    dispatch(toggleMenu());
  };

  return (
    <div className={clsx(styles.sidebar, { [styles.opened]: menuOpened })}>
      <Link className={styles.logoWrapper} to="/dashboard">
        <img
          className={styles.logoDesktop}
          src={process.env.PUBLIC_URL + "/logo-lg.svg"}
          alt="My healthy plate logo"
        />
        <img
          className={styles.logoMobile}
          src={process.env.PUBLIC_URL + "/logo-sm.png"}
          alt="My healthy plate logo"
        />
      </Link>
      <ul className={styles.nav}>
        <NavBarItem
          link={"/dashboard"}
          icon={<OverviewIcon />}
          text={"Overview"}
          onClick={handleClick}
        />
        <NavBarItem
          link={"/recipes"}
          icon={<RecipesIcon />}
          text={"Recipes"}
          onClick={handleClick}
        />
        <NavBarItem
          link={"/settings"}
          icon={<SettingsIcon />}
          text={"Settings"}
          onClick={handleClick}
        />
      </ul>
    </div>
  );
};

export default NavBar;
