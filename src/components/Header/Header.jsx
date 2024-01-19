import { Link } from "react-router-dom";
import styles from './Header.module.css';
import cn from 'classnames';
import ButtonLink from "../ButtonLink/ButtonLink";

const Header = ({loginButtonRequired}) => {
  return (
    <header className={styles.header}>
      <div className={cn("container", styles.container)}>
        <Link to={"/"}>
          <img src={process.env.PUBLIC_URL + '/logo-lg.svg'} alt="My healthy plate logo" />
        </Link>
        {loginButtonRequired && <ButtonLink className={styles.button} link={"/login"}>Log In</ButtonLink>}
      </div>
    </header>
  );
}

export default Header;