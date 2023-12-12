import { NavLink } from "react-router-dom";
import styles from "./NavBarItem.module.css";
import cn from "classnames";

const NavBarItem = ({ link, icon, text }) => {
  return (
    <li className={styles.li}>
      <NavLink
        to={link}
        className={({ isActive }) => {
          return isActive
            ? cn(styles.nav__item, styles.nav__item_active)
            : styles.nav__item;
        }}
      >
        <div className={styles.iconWrapper}>{icon}</div>
        {text}
      </NavLink>
    </li>
  );
};

export default NavBarItem;
