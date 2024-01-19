import { useSelector } from "react-redux";
import { selectUser } from "../redux/user/userSlice";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { Navigate } from "react-router-dom";
import cn from "classnames";
import styles from './Page.module.scss';

const RequireUnauth = ({ children, loginButtonRequired }) => {
  const user = useSelector(selectUser);
  if (user) {
    return <Navigate replace to="/dashboard" />;
  }
  return (
    <div className={styles.wrapper}>
      <Header loginButtonRequired={loginButtonRequired} />
      <main className={cn("container", styles.main)}>{children}</main>
      <Footer />
    </div>
  );
};

export default RequireUnauth;
