import { Link } from "react-router-dom";
import styles from "../Button/Button.module.css";
import clsx from "clsx";

const ButtonLink = ({ className, link, variant, children }) => {
  const btnClasses = clsx(className, styles.root, {
    [styles.primary]: variant === "primary",
    [styles.addRecipe]: variant === "addRecipe",
  });

  return (
    <Link to={link} className={btnClasses}>
      {children}
    </Link>
  );
};

export default ButtonLink;
