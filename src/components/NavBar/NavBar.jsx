import { Link } from "react-router-dom";
import NavBarItem from "../NavBarItem/NavBarItem";
import logo from '../../images/logo.svg'
import styles from './Navbar.module.css';
import OverviewIcon from "../Icons/OverviewIcon";
import RecipesIcon from "../Icons/RecipesIcon";
import SettingsIcon from "../Icons/SettingsIcon";

const NavBar = () => {
  return (
    <div className={styles.sidebar}>
      <Link to="/dashboard"><img src={logo} alt="My healthy plate logo" /></Link>
      <ul className={styles.nav}>
        <NavBarItem 
          link={'/dashboard'}
          icon={<OverviewIcon />}
          text={'Overview'}
        />
        <NavBarItem 
          link={'/recipes'}
          icon={<RecipesIcon />}
          text={'Recipes'}
        />
        <NavBarItem 
          link={'/settings'}
          icon={<SettingsIcon />}
          text={'Settings'}
        />
      </ul>
    </div>
  );
}

export default NavBar;