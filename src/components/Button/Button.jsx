import styles from "./Button.module.css";
import clsx from "clsx";

const Button = ({ className, variant, children, icon, ...rest }) => {
  const btnClasses = clsx(className, styles.root, {
    [styles.primary]: variant === "primary",
    [styles.alert]: variant === "alert",
  });

  return (
    <button className={btnClasses} {...rest}>
      {icon && <div className={styles.iconWrapper}>{icon}</div>}
      {children}
    </button>
  );
};

export default Button;
