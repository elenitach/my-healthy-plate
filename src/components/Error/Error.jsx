import { OverlayTrigger, Tooltip } from "react-bootstrap";
import styles from "./Error.module.css";
import ErrorIcon from "../Icons/ErrorIcon";
import clsx from "clsx";

const Error = ({ message, placement }) => {
  return (
    <OverlayTrigger
      placement={placement}
      overlay={<Tooltip>{message}</Tooltip>}
    >
      <span
        className={clsx(styles.errorIcon, {
          [styles.placementRight]: placement === "right",
        })}
      >
        <ErrorIcon />
      </span>
    </OverlayTrigger>
  );
};

export default Error;
