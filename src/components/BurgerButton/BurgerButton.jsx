import clsx from "clsx";
import styles from "./BurgerButton.module.scss";

const BurgerButton = ({ className, checked, onClick }) => {
  return (
    <div
      className={clsx(styles.root, className, { [styles.checked]: checked })}
      onClick={onClick}
    >
      <div className={styles.line}></div>
      <div className={styles.line}></div>
      <div className={styles.line}></div>
    </div>
  );
};

export default BurgerButton;
