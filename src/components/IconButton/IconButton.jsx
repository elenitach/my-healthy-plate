import styles from "./IconButton.module.css";
import clsx from "clsx";

const IconButton = ({ className, icon, ...rest }) => {
  const btnClasses = clsx(className, styles.root);

  return (
    <button className={btnClasses} {...rest}>
      {icon}
    </button>
  );
};

export default IconButton;
