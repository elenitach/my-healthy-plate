import { useState } from "react";
import { selectUser, updateUser } from "../../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import Form from '../Form/Form';
import styles from '../Form/Form.module.css';
import cn from 'classnames';
import Button from "../Button/Button";
import { Modal } from "react-bootstrap";
import { BMR, getEnergyFromActivityLevel } from "../../utils/equations";
import { getAgeFromBirthdate } from "../../utils/converters";

const Settings = () => {
  const user = useSelector(selectUser);

  const [name, setName] = useState(user.name);
  const [isMale, setIsMale] = useState(user.isMale);
  const [birthDate, setBirthDate] = useState(user.birthDate);
  const [height, setHeight] = useState(user.height);
  const [weight, setWeight] = useState(user.weight);
  const [activityLevel, setActivityLevel] = useState(user.activityLevel || 0);
  const [updateStatus, setUpdateStatus] = useState('idle');
  const [isModalShown, setIsModalShown] = useState(false);
  const [emptyBirthdateError, setEmptyBirthdateError] = useState(false);
  

  const dispatch = useDispatch();

  const handleNameChange = (event) => {
    setName(event.target.value);
  }

  const handleGenderChange = (event) => {
    setIsMale(event.target.value === 'male');
  }

  const handleBirthdateChange = (event) => {
    setEmptyBirthdateError(event.target.value === '');
    setBirthDate(event.target.value);
  }

  const handleHeightChange = (event) => {
    setHeight(+event.target.value);
  }

  const handleWeightChange = (event) => {
    setWeight(+event.target.value);
  }

  const handleActivityLevelChange = (event) => {
    setActivityLevel(+event.target.value);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setEmptyBirthdateError(birthDate === '');
    if (updateStatus === 'idle' && !emptyBirthdateError) {
      try {
        setUpdateStatus('pending');
        await dispatch(updateUser({
            id: user.id,
            name: name || 'user',
            isMale,
            birthDate,
            height,
            weight,
            activityLevel
          })).unwrap();
        setIsModalShown(true);
      } catch(err) {
        console.log(err);
      } finally {
        setUpdateStatus('idle');
      }
    }    
  }

  const handleModalClose = () => {
    setIsModalShown(false);
  }

  const bmr = BMR(isMale, getAgeFromBirthdate(new Date(birthDate)), height, weight);
  const activityEnergy = getEnergyFromActivityLevel(activityLevel, bmr);

  return (
    <Form onSubmit={handleSubmit}>
      <h3 className={styles.section__header}>Personal info</h3>
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
            className={cn(styles.input, styles.form__item_inline, styles.input_radio)}
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
            className={cn(styles.input, styles.form__item_inline, styles.input_radio)}
            value="female"
            checked={!isMale}
            onChange={handleGenderChange}
          /> 
          <label htmlFor="female">Female</label>
        </div>
      </div>

      <div className={styles.form__item}>Birth date</div>
      <input 
        type="date" 
        className={cn(styles.input, styles.form__item)}
        value={birthDate}
        onChange={handleBirthdateChange}
      />
      {emptyBirthdateError && <div className="error">Please, set your date of birth</div>}

      <div className={styles.form__item}>Height (cm)</div>
      <input 
        type="number" 
        min="1" 
        max="300" 
        className={cn(styles.input, styles.form__item)}
        value={height}
        onChange={handleHeightChange}
      />

      <div className={styles.form__item}>Weight (kg)</div>
      <input 
        type="number" 
        min="1" 
        max="300" 
        className={cn(styles.input, styles.form__item)}
        value={weight}
        onChange={handleWeightChange}
      />

      <div className={styles.form__item}>Activity level</div>
      <select 
        className={styles.form__select} 
        value={activityLevel} 
        onChange={handleActivityLevelChange}
      >
        <option value={0}>
          None
        </option>
        <option value={1}>
          Sedentary (BMR x 0.2)
        </option>
        <option value={2}>
          Lightly active (BMR x 0.375)
        </option>
        <option value={3}>
          Moderately active (BMR x 0.5)
        </option>
        <option value={4}>
          Very active (BMR x 0.9)
        </option>
      </select>
      {
        birthDate !== '' && bmr > 0 &&
        <div className={styles.form__item}>
          Total energy burned: {bmr + activityEnergy} kcal 
          <br />
          (BMR: {bmr} kcal + Activity: {activityEnergy} kcal)
        </div>
      }
      {bmr <= 0 && <div className="error">Invalid height or weight</div>}

      <Button>
        Save
      </Button>
      <Modal show={isModalShown} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Data is successfully updated!</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button onClick={handleModalClose}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </Form>
  );
}

export default Settings;