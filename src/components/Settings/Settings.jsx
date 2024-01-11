import { useState } from "react";
import { selectUser, updateUser } from "../../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import Form from "../AuthForm/AuthForm";
import styles from "../AuthForm/AuthForm.module.css";
import cn from "classnames";
import Button from "../Button/Button";
import { Modal, Spinner } from "react-bootstrap";
import { BMR, getEnergyFromActivityLevel } from "../../utils/equations";
import { getAgeFromBirthdate } from "../../utils/converters";
import {
  INVALID_BIRTHDATE_ERROR_MESSAGE,
  INVALID_BMR_ERROR_MESSAGE,
  INVALID_HEIGHT_ERROR_MESSAGE,
  INVALID_WEIGHT_ERROR_MESSAGE,
  birthDateIsValid,
  heightIsValid,
  weightIsValid,
} from "../../utils/validators";
import { userDefaultData } from "../../utils/constants";
import Error from "../Error/Error";
import clsx from "clsx";

const Settings = () => {
  const user = useSelector(selectUser);

  const [name, setName] = useState(user.name);
  const [isMale, setIsMale] = useState(user.isMale);
  const [birthDate, setBirthDate] = useState(user.birthDate);
  const [height, setHeight] = useState(user.height);
  const [weight, setWeight] = useState(user.weight);
  const [activityLevel, setActivityLevel] = useState(user.activityLevel || 0);
  const [isModalShown, setIsModalShown] = useState(false);

  const [birthDateError, setBirthDateError] = useState(null);
  const [heightError, setHeightError] = useState(null);
  const [weightError, setWeightError] = useState(null);
  const [bmrError, setBmrError] = useState(null);

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleGenderChange = (event) => {
    setIsMale(event.target.value === "male");
    setBmrError(null);
  };

  const handleBirthdateChange = (event) => {
    setBirthDate(event.target.value);
    setBirthDateError(null);
    setBmrError(null);
  };

  const handleHeightChange = (event) => {
    setHeight(event.target.value);
    setHeightError(null);
    setBmrError(null);
  };

  const handleWeightChange = (event) => {
    setWeight(event.target.value);
    setWeightError(null);
    setBmrError(null);
  };

  const handleActivityLevelChange = (event) => {
    setActivityLevel(+event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    let errorOcurred = false;

    if (!weightIsValid(+weight)) {
      setWeightError(INVALID_WEIGHT_ERROR_MESSAGE);
      errorOcurred = true;
    }

    if (!heightIsValid(+height)) {
      setHeightError(INVALID_HEIGHT_ERROR_MESSAGE);
      errorOcurred = true;
    }

    if (!birthDateIsValid(birthDate)) {
      setBirthDateError(INVALID_BIRTHDATE_ERROR_MESSAGE);
      errorOcurred = true;
    }

    if (!errorOcurred) {
      const bmr = BMR(
        isMale,
        getAgeFromBirthdate(new Date(birthDate)),
        +height,
        +weight
      );
      if (bmr < 0) {
        setBmrError(INVALID_BMR_ERROR_MESSAGE);
        errorOcurred = true;
      }
    }

    if (!errorOcurred) {
      try {
        await dispatch(
          updateUser({
            id: user.id,
            name: name === "" ? userDefaultData.name : name,
            isMale,
            birthDate,
            height,
            weight,
            activityLevel,
          })
        ).unwrap();
        setIsModalShown(true);
      } catch (err) {
        console.log(err);
      }
    }

    setLoading(false);
  };

  const handleModalClose = () => {
    setIsModalShown(false);
  };

  const bmr = BMR(
    isMale,
    getAgeFromBirthdate(new Date(birthDate)),
    height,
    weight
  );
  const activityEnergy = getEnergyFromActivityLevel(activityLevel, bmr);

  return (
    <Form onSubmit={handleSubmit}>
      <h3 className={styles.section__header}>
        Personal info
        {bmrError && <Error message={bmrError} placement="right" />}
      </h3>
      <div className={styles.form__item}>Name</div>
      <input
        type="text"
        className={cn(styles.input, styles.form__item)}
        placeholder="Your name"
        value={name}
        onChange={handleNameChange}
      />

      <div className={styles.form__item}>Gender</div>
      <div className="flex-wrapper">
        <div className={styles.radio__item}>
          <input
            id="male"
            type="radio"
            name="gender"
            className={cn(
              styles.input,
              styles.form__item_inline,
              styles.input_radio
            )}
            value="male"
            checked={isMale}
            onChange={handleGenderChange}
          />
          <label htmlFor="male">Male</label>
        </div>
        <div className={styles.radio__item}>
          <input
            id="female"
            type="radio"
            name="gender"
            className={cn(
              styles.input,
              styles.form__item_inline,
              styles.input_radio
            )}
            value="female"
            checked={!isMale}
            onChange={handleGenderChange}
          />
          <label htmlFor="female">Female</label>
        </div>
      </div>

      <div className={styles.form__item}>
        Birth date
        {birthDateError && <Error message={birthDateError} placement="right" />}
      </div>
      <input
        type="date"
        className={clsx(styles.input, styles.form__item, {
          [styles.errorInput]: birthDateError || bmrError,
        })}
        value={birthDate}
        onChange={handleBirthdateChange}
      />

      <div className={styles.form__item}>
        Height (cm)
        {heightError && <Error message={heightError} placement="right" />}
      </div>
      <input
        type="number"
        className={clsx(styles.input, styles.form__item, {
          [styles.errorInput]: heightError || bmrError,
        })}
        value={height}
        onChange={handleHeightChange}
      />

      <div className={styles.form__item}>
        Weight (kg)
        {weightError && <Error message={weightError} placement="right" />}
      </div>
      <input
        type="number"
        className={clsx(styles.input, styles.form__item, {
          [styles.errorInput]: weightError || bmrError,
        })}
        value={weight}
        onChange={handleWeightChange}
      />

      <div className={styles.form__item}>Activity level</div>
      <select
        className={styles.form__select}
        value={activityLevel}
        onChange={handleActivityLevelChange}
      >
        <option value={0}>None</option>
        <option value={1}>Sedentary (BMR x 0.2)</option>
        <option value={2}>Lightly active (BMR x 0.375)</option>
        <option value={3}>Moderately active (BMR x 0.5)</option>
        <option value={4}>Very active (BMR x 0.9)</option>
      </select>

      {birthDate !== "" && bmr > 0 && (
        <div className={styles.form__item}>
          Total energy burned: {bmr + activityEnergy} kcal
          <br />
          (BMR: {bmr} kcal + Activity: {activityEnergy} kcal)
        </div>
      )}

      <Button>
        Save{loading && <Spinner className={styles.buttonSpinner} size="sm" />}
      </Button>
      <Modal show={isModalShown} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Data is successfully updated!</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button onClick={handleModalClose}>OK</Button>
        </Modal.Footer>
      </Modal>
    </Form>
  );
};

export default Settings;
