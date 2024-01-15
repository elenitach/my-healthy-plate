import { useNavigate } from "react-router-dom";
import EditableListItem from "../EditableListItem/EditableListItem";
import styles from "../RecipeInfo/RecipeInfo.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import Button from "../Button/Button";
import { uid } from "uid";
import { addRecipe } from "../../redux/recipes/recipesSlice";
import cn from "classnames";
import { selectUser } from "../../redux/user/userSlice";
import { Modal, Spinner } from "react-bootstrap";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../firebaseConfig";
import IconButton from "../IconButton/IconButton";
import PlusIcon from "../Icons/PlusIcon";
import { EMPTY_RECIPE_TITLE_ERROR_MESSAGE } from "../../utils/validators";
import { INFINITE_RECIPE_TIME } from "../../utils/constants";

const AddRecipe = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [currentTitle, setCurrentTitle] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [currentDifficulty, setCurrentDifficulty] = useState(1);
  const [currentIngredients, setCurrentIngredients] = useState([]);
  const [currentSteps, setCurrentSteps] = useState([]);
  const [currentCover, setCurrentCover] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalShown, setIsModalShown] = useState(false);
  const [emptyTitleError, setEmptyTitleError] = useState(false);
  const [coverId] = useState(uid());

  const user = useSelector(selectUser);

  const handleTitleChange = (event) => {
    setEmptyTitleError(event.target.value === "");
    setCurrentTitle(event.target.value);
  };

  const handleTimeChange = (event) => {
    setCurrentTime(event.target.value);
  };

  const handleDifficultyChange = (event) => {
    setCurrentDifficulty(parseInt(event.target.value));
  };

  const handleRemoveIngredientClick = (index) => {
    const updatedIngredients = [
      ...currentIngredients.slice(0, index),
      ...currentIngredients.slice(index + 1),
    ];
    setCurrentIngredients(updatedIngredients);
  };

  const handleAddIngredientClick = () => {
    if (currentIngredients.at(-1)?.value !== "") {
      setCurrentIngredients([...currentIngredients, { id: uid(), value: "" }]);
    }
  };

  const handleIngredientChange = (index, item) => {
    setCurrentIngredients([
      ...currentIngredients.slice(0, index),
      item,
      ...currentIngredients.slice(index + 1),
    ]);
  };

  const handleRemoveStepClick = (index) => {
    const updatedSteps = [
      ...currentSteps.slice(0, index),
      ...currentSteps.slice(index + 1),
    ];
    setCurrentSteps(updatedSteps);
  };

  const handleAddStepClick = () => {
    if (currentSteps.at(-1)?.value !== "") {
      setCurrentSteps([...currentSteps, { id: uid(), value: "" }]);
    }
  };

  const handleStepChange = (index, item) => {
    setCurrentSteps([
      ...currentSteps.slice(0, index),
      item,
      ...currentSteps.slice(index + 1),
    ]);
  };

  const handleSaveClick = async () => {
    setEmptyTitleError(currentTitle === "");
    if (currentTitle === "") return;

    try {
      setLoading(true);
      await dispatch(
        addRecipe({
          userId: user.id,
          title: currentTitle,
          time: Math.min(INFINITE_RECIPE_TIME, +currentTime),
          difficulty: currentDifficulty,
          ingredients:
            currentIngredients.at(-1).value !== ""
              ? currentIngredients
              : currentIngredients.slice(0, -1),
          steps:
            currentSteps.at(-1).value !== ""
              ? currentSteps
              : currentSteps.slice(0, -1),
          cover: currentCover,
          timestamp: new Date(),
        })
      ).unwrap();
      setIsModalShown(true);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setIsModalShown(false);
    navigate(-1);
  };

  const handleChangeCoverClick = (event) => {
    const file = event.target.files[0];
    const storageRef = ref(storage, coverId);

    const task = uploadBytesResumable(storageRef, file);

    task.on("state_changed", null, null, () => {
      getDownloadURL(task.snapshot.ref).then((url) => {
        setCurrentCover(url);
      });
    });
  };

  const handleResetCoverClick = () => {
    setCurrentCover("");
  };

  return (
    <div className={styles.recipePage}>
      <header
        className={styles.recipePage__header}
        style={{
          backgroundImage: currentCover !== "" && `url(${currentCover})`,
        }}
      >
        <div className={styles.recipe__data}>
          <input
            type="text"
            className={cn(styles.recipePage__title, styles.input)}
            value={currentTitle}
            onChange={handleTitleChange}
            placeholder="Recipe title"
          />
          {emptyTitleError && (
            <div className="error">{EMPTY_RECIPE_TITLE_ERROR_MESSAGE}</div>
          )}
          <div className={styles.recipePage__time}>Time (in minutes):</div>
          <input
            type="number"
            className={cn(styles.recipe__time, styles.input, styles.input_time)}
            value={currentTime}
            onChange={handleTimeChange}
          />
          <div className={styles.recipePage__difficulty}>
            Difficulty:
            <select
              className={styles.difficulty__value}
              value={currentDifficulty}
              onChange={handleDifficultyChange}
            >
              <option value={1}>easy</option>
              <option value={2}>medium</option>
              <option value={3}>hard</option>
            </select>
          </div>

          <div className={styles.section_changeCover}>
            <div>Set a cover image: </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleChangeCoverClick}
            />
          </div>
          <Button
            className={styles.button_resetCover}
            onClick={handleResetCoverClick}
          >
            Reset cover
          </Button>
        </div>
      </header>
      <div className={styles.recipePage__main}>
        <div className={styles.headerWrapper}>
          <h2 className={styles.section__header}>Ingredients</h2>
          <IconButton
            className={styles.buttonAdd}
            onClick={handleAddIngredientClick}
            icon={<PlusIcon />}
          />
        </div>
        <ul>
          {currentIngredients.map((item, index) => (
            <EditableListItem
              key={item.id}
              id={item.id}
              initialValue={item.value}
              index={index}
              removeAction={handleRemoveIngredientClick}
              changeAction={handleIngredientChange}
              isEditing
            />
          ))}
        </ul>

        <div className={styles.headerWrapper}>
          <h2 className={styles.section__header}>Steps</h2>
          <IconButton
            className={styles.buttonAdd}
            onClick={handleAddStepClick}
            icon={<PlusIcon />}
          />
        </div>
        <ol>
          {currentSteps.map((item, index) => (
            <EditableListItem
              key={item.id}
              id={item.id}
              initialValue={item.value}
              index={index}
              removeAction={handleRemoveStepClick}
              changeAction={handleStepChange}
              isEditing
            />
          ))}
        </ol>
        <Button variant="primary" onClick={handleSaveClick} disabled={loading}>
          Save
          {loading && <Spinner className={styles.buttonSpinner} size="sm" />}
        </Button>
        <Modal show={isModalShown} onHide={handleModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>Recipe is successfully created!</Modal.Title>
          </Modal.Header>
          <Modal.Footer>
            <Button onClick={handleModalClose}>OK</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default AddRecipe;
