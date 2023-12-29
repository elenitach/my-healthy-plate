import { useState } from "react";
import styles from "./EditableListItem.module.css";
import IconButton from "../IconButton/IconButton";
import RemoveIcon from "../Icons/RemoveIcon";
import AcceptIcon from "../Icons/AcceptIcon";
import EditIcon from "../Icons/EditIcon";
import cn from "classnames";

const EditableListItem = ({
  id,
  index,
  initialValue,
  editAction,
  removeAction,
  changeAction,
  isEditing,
}) => {
  const [editing, setEditing] = useState(isEditing || false);
  const [value, setValue] = useState(initialValue);

  const handleChange = (e) => {
    if (changeAction) {
      changeAction(index, { id, value: e.target.value });
    }
    setValue(e.target.value);
  };

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleAcceptClick = () => {
    editAction(index, { id, value });
    setEditing(false);
  };

  const handleRemoveClick = () => {
    removeAction(index);
  };

  return (
    <li className={styles.item}>
      <IconButton
        className={cn(styles.button, styles.buttonRemove)}
        onClick={handleRemoveClick}
        icon={<RemoveIcon />}
      />
      {editing ? (
        <input
          type="text"
          className={styles.input}
          value={value}
          onChange={handleChange}
        />
      ) : (
        <div className={styles.value}>{value}</div>
      )}
      {editAction &&
        (editing ? (
          <IconButton
            className={cn(styles.button, styles.buttonAccept)}
            onClick={handleAcceptClick}
            icon={<AcceptIcon />}
          />
        ) : (
          <IconButton
            className={cn(styles.button, styles.buttonEdit)}
            onClick={handleEditClick}
            icon={<EditIcon />}
          />
        ))}
    </li>
  );
};

export default EditableListItem;
