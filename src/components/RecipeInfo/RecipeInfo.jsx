import { useNavigate, useParams } from "react-router-dom";
import { minutesToHoursMinutesString } from "../../utils/converters";
import EditableListItem from "../EditableListItem/EditableListItem";
import styles from "./RecipeInfo.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteRecipe,
  selectRecipes,
  updateRecipe,
} from "../../redux/recipes/recipesSlice";
import { useEffect, useState } from "react";
import Button from "../Button/Button";
import { uid } from "uid";
import Modal from "react-bootstrap/Modal";
import cn from "classnames";
import { storage } from "../../firebaseConfig";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import IconButton from "../IconButton/IconButton";
import PlusIcon from "../Icons/PlusIcon";
import EditIcon from "../Icons/EditIcon";
import AcceptIcon from "../Icons/AcceptIcon";

const RecipeInfo = () => {
  const { id } = useParams();
  const recipes = useSelector(selectRecipes);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isTitleEditing, setIsTitleEditing] = useState(false);
  const [isDifficultyEditing, setIsDifficultyEditing] = useState(false);
  const [isTimeEditing, setIsTimeEditing] = useState(false);
  const [isIngredientAdding, setIsIngredientAdding] = useState(false);
  const [isStepAdding, setIsStepAdding] = useState(false);
  const [isModalShown, setIsModalShown] = useState(false);
  const [emptyTitleError, setEmptyTitleError] = useState(false);

  useEffect(() => {
    if (!recipes.map((r) => r.id).includes(id)) {
      navigate("/not_found", { replace: true });
    }
  });

  const { title, time, difficulty, ingredients, steps, cover } = recipes.find(
    (r) => r.id === id
  ) || {
    title: "",
    time: 0,
    difficulty: 1,
    ingredients: [],
    steps: [],
    cover: "",
  };

  const [currentTitle, setCurrentTitle] = useState(title);
  const [currentTime, setCurrentTime] = useState(time);
  const [currentDifficulty, setCurrentDifficulty] = useState(difficulty);
  const [currentIngredients, setCurrentIngredients] = useState([
    ...ingredients,
  ]);
  const [currentSteps, setCurrentSteps] = useState([...steps]);
  const [currentCover, setCurrentCover] = useState(cover);

  const timeHM = minutesToHoursMinutesString(currentTime);

  const handleTitleChange = (event) => {
    setEmptyTitleError(event.target.value === "");
    setCurrentTitle(event.target.value);
  };

  const handleTimeChange = (event) => {
    const value = event.target.value;
    setCurrentTime(value === "" ? 0 : parseInt(value));
  };

  const handleDifficultyChange = (event) => {
    setCurrentDifficulty(parseInt(event.target.value));
  };

  const handleEditTitleClick = () => {
    setIsTitleEditing(true);
  };

  const handleEditTimeClick = () => {
    setIsTimeEditing(true);
  };

  const handleEditDifficultyClick = () => {
    setIsDifficultyEditing(true);
  };

  const handleAcceptTitleClick = () => {
    if (currentTitle !== "") {
      dispatch(updateRecipe({ id, title: currentTitle }));
      setIsTitleEditing(false);
    }
  };

  const handleAcceptTimeClick = () => {
    dispatch(updateRecipe({ id, time: currentTime }));
    setIsTimeEditing(false);
  };

  const handleAcceptDifficultyClick = () => {
    dispatch(updateRecipe({ id, difficulty: currentDifficulty }));
    setIsDifficultyEditing(false);
  };

  const handleAcceptIngredientsClick = (index, item) => {
    if (index === currentIngredients.length - 1 && isIngredientAdding) {
      setIsIngredientAdding(false);
    }
    const updatedIngredients = [
      ...currentIngredients.slice(0, index),
      item,
      ...currentIngredients.slice(index + 1),
    ];
    setCurrentIngredients(updatedIngredients);
    dispatch(updateRecipe({ id, ingredients: updatedIngredients }));
  };

  const handleRemoveIngredientsClick = (index) => {
    if (index === currentIngredients.length - 1 && isIngredientAdding) {
      setIsIngredientAdding(false);
    }
    const updatedIngredients = [
      ...currentIngredients.slice(0, index),
      ...currentIngredients.slice(index + 1),
    ];
    setCurrentIngredients(updatedIngredients);
    dispatch(updateRecipe({ id, ingredients: updatedIngredients }));
  };

  const handleAddIngredientClick = () => {
    if (!isIngredientAdding) {
      setCurrentIngredients([...currentIngredients, { id: uid(), value: "" }]);
      setIsIngredientAdding(true);
    }
  };

  const handleAcceptStepsClick = (index, item) => {
    if (index === currentSteps.length - 1 && isStepAdding) {
      setIsStepAdding(false);
    }
    const updatedSteps = [
      ...currentSteps.slice(0, index),
      item,
      ...currentSteps.slice(index + 1),
    ];
    setCurrentSteps(updatedSteps);
    dispatch(updateRecipe({ id, steps: updatedSteps }));
  };

  const handleRemoveStepsClick = (index) => {
    if (index === currentSteps.length - 1 && isStepAdding) {
      setIsStepAdding(false);
    }
    const updatedSteps = [
      ...currentSteps.slice(0, index),
      ...currentSteps.slice(index + 1),
    ];
    setCurrentSteps(updatedSteps);
    dispatch(updateRecipe({ id, steps: updatedSteps }));
  };

  const handleAddStepClick = () => {
    if (!isStepAdding) {
      setCurrentSteps([...currentSteps, { id: uid(), value: "" }]);
      setIsStepAdding(true);
    }
  };

  const handleDeleteClick = () => {
    setIsModalShown(true);
  };

  const handleModalClose = () => {
    setIsModalShown(false);
  };

  const handleYesClick = () => {
    dispatch(deleteRecipe(id));
    setIsModalShown(false);
    navigate(-1);
  };

  const handleGoBackClick = () => {
    navigate(-1);
  };

  const handleChangeCoverClick = (event) => {
    const file = event.target.files[0];
    const storageRef = ref(storage, id);

    const task = uploadBytesResumable(storageRef, file);

    task.on("state_changed", null, null, () => {
      getDownloadURL(task.snapshot.ref).then((url) => {
        setCurrentCover(url);
        dispatch(updateRecipe({ id, cover: url }));
      });
    });
  };

  const handleResetCoverClick = () => {
    setCurrentCover("");
    dispatch(updateRecipe({ id, cover: "" }));
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
          <div className="flex-wrapper_centered">
            {isTitleEditing ? (
              <>
                <input
                  type="text"
                  className={cn(styles.recipePage__title, styles.input)}
                  value={currentTitle}
                  onChange={handleTitleChange}
                />
              </>
            ) : (
              <h1 className={styles.recipePage__title}>{currentTitle}</h1>
            )}
            {isTitleEditing ? (
              <IconButton
                className={styles.buttonAccept}
                onClick={handleAcceptTitleClick}
                icon={<AcceptIcon />}
              />
            ) : (
              <IconButton
                className={styles.buttonEdit}
                onClick={handleEditTitleClick}
                icon={<EditIcon />}
              />
            )}
          </div>

          {emptyTitleError && (
            <div className="error">Please, give your recipe a title!</div>
          )}

          <div className={cn("flex-wrapper_centered", styles.recipePage__time)}>
            {isTimeEditing ? (
              <input
                type="number"
                className={cn(
                  styles.recipe__time,
                  styles.input,
                  styles.input_time
                )}
                value={currentTime}
                onChange={handleTimeChange}
                min={0}
                max={5000}
              />
            ) : (
              <div className={styles.recipe__time}>{timeHM}</div>
            )}
            {isTimeEditing ? (
              <IconButton
                className={cn(styles.buttonSmall, styles.buttonAccept)}
                onClick={handleAcceptTimeClick}
                icon={<AcceptIcon />}
              />
            ) : (
              <IconButton
                className={cn(styles.buttonSmall, styles.buttonEdit)}
                onClick={handleEditTimeClick}
                icon={<EditIcon />}
              />
            )}
          </div>

          <div className={styles.recipePage__difficulty}>
            Difficulty:
            {isDifficultyEditing ? (
              <select
                className={styles.difficulty__value}
                value={currentDifficulty}
                onChange={handleDifficultyChange}
              >
                <option value={1}>easy</option>
                <option value={2}>medium</option>
                <option value={3}>hard</option>
              </select>
            ) : (
              <img
                className={styles.difficulty__value}
                src={require(`../Recipe/res/difficulty_${currentDifficulty}.svg`)}
                alt=""
              />
            )}
            {isDifficultyEditing ? (
              <IconButton
                className={cn(styles.buttonSmall, styles.buttonAccept)}
                onClick={handleAcceptDifficultyClick}
                icon={<AcceptIcon />}
              />
            ) : (
              <IconButton
                className={cn(styles.buttonSmall, styles.buttonEdit)}
                onClick={handleEditDifficultyClick}
                icon={<EditIcon />}
              />
            )}
          </div>

          <div className={styles.section_changeCover}>
            <div className={styles.coverHeader}>Set a cover image: </div>
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
              editAction={handleAcceptIngredientsClick}
              removeAction={handleRemoveIngredientsClick}
              isEditing={
                index === currentIngredients.length - 1 && isIngredientAdding
              }
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
              editAction={handleAcceptStepsClick}
              removeAction={handleRemoveStepsClick}
              isEditing={index === currentSteps.length - 1 && isStepAdding}
            />
          ))}
        </ol>
        <div className={styles.recipe__footerContainer}>
          <Button onClick={handleGoBackClick}>Go back</Button>
          <Button onClick={handleDeleteClick} variant="alert">
            Delete
          </Button>
        </div>
        <Modal show={isModalShown} onHide={handleModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>Delete recipe?</Modal.Title>
          </Modal.Header>
          <Modal.Footer>
            <Button onClick={handleModalClose}>No</Button>
            <Button variant="primary" onClick={handleYesClick}>
              Yes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default RecipeInfo;
