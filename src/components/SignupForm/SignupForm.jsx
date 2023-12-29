import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebaseConfig";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../redux/user/userSlice";
import { useDispatch } from "react-redux";
import {
  passwordIsValid,
  invalidPasswordErrorMessage,
} from "../../utils/validators";
import { doc, setDoc } from "firebase/firestore";
import Form from "../Form/Form";
import styles from "../Form/Form.module.css";
import cn from "classnames";
import Button from "../Button/Button";
import ButtonLink from "../ButtonLink/ButtonLink";
import { BMR } from "../../utils/equations";
import { getAgeFromBirthdate } from "../../utils/converters";
import { userDefaultData } from "../../utils/constants";

const SignupForm = () => {
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isMale, setIsMale] = useState(userDefaultData.isMale);
  const [birthDate, setBirthDate] = useState(userDefaultData.birthDate);
  const [height, setHeight] = useState(userDefaultData.height);
  const [weight, setWeight] = useState(userDefaultData.weight);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setError("");
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setError("");
    setConfirmPassword(event.target.value);
  };

  const handleGenderChange = (event) => {
    setError("");
    setIsMale(event.target.value === "male");
  };

  const handleBirthdateChange = (event) => {
    setError("");
    setBirthDate(event.target.value);
  };

  const handleHeightChange = (event) => {
    setError("");
    setHeight(event.target.value);
  };

  const handleWeightChange = (event) => {
    setError("");
    setWeight(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    let errorOcurred = error !== "";

    const bmr = BMR(
      isMale,
      getAgeFromBirthdate(
        new Date(birthDate === "" ? userDefaultData.birthDate : birthDate)
      ),
      +height,
      +weight
    );
    if (bmr < 0) {
      setError("Invalid personal info");
      errorOcurred = true;
    }

    if (!passwordIsValid(password)) {
      setError(invalidPasswordErrorMessage);
      errorOcurred = true;
    }

    if (password !== confirmPassword) {
      setError("The passwords do not match");
      errorOcurred = true;
    }

    if (!errorOcurred) {
      try {
        const userAuth = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const nameToStore = name === "" ? "user" : name;
        try {
          await setDoc(doc(db, "users", userAuth.user.uid), {
            name: nameToStore,
            isMale,
            birthDate: birthDate === '' ? userDefaultData.birthDate : birthDate,
            height: +height,
            weight: +weight,
          });
        } catch (err) {
          console.log(err);
        }
        dispatch(
          login({
            email: userAuth.user.email,
            id: userAuth.user.uid,
            name: nameToStore,
            isMale,
            birthDate: birthDate,
            height: +height,
            weight: +weight,
            activityLevel: 2,
          })
        );
        navigate("/dashboard");
      } catch (err) {
        console.log(err);
        setError("An error ocurred");
      }
    }
    setLoading(false);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h2 className={styles.form__header}>Create a new account!</h2>
      <div className={styles.form__item}>Name</div>
      <input
        type="text"
        className={cn(styles.input, styles.form__item)}
        placeholder="Your name"
        value={name}
        onChange={handleNameChange}
      />

      <div className={styles.form__item}>
        Email <span className={styles.input_required}>*</span>
      </div>
      <input
        type="email"
        className={cn(styles.input, styles.form__item)}
        placeholder="Email address"
        required
        value={email}
        onChange={handleEmailChange}
      />

      <div className={styles.form__item}>
        Password <span className={styles.input_required}>*</span>
      </div>
      <input
        type="password"
        className={cn(styles.input, styles.form__item)}
        placeholder="Password"
        required
        value={password}
        onChange={handlePasswordChange}
      />

      <div className={styles.form__item}>
        Confirm password <span className={styles.input_required}>*</span>
      </div>
      <input
        type="password"
        className={cn(styles.input, styles.form__item)}
        placeholder="Password"
        required
        value={confirmPassword}
        onChange={handleConfirmPasswordChange}
      />

      <h3 className={styles.section__header}>Personal info</h3>

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
          <label for="male">Male</label>
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
          <label for="female">Female</label>
        </div>
      </div>
      <div className={styles.form__item}>Birth date</div>
      <input
        type="date"
        min="1900-01-01"
        max={`${new Date().getFullYear()}-${
          new Date().getMonth() + 1
        }-${new Date().getDate()}`}
        className={cn(styles.input, styles.form__item)}
        value={birthDate}
        onChange={handleBirthdateChange}
      />

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

      <Button
        className={styles.form__button}
        variant="primary"
        disabled={loading}
      >
        SIGN UP
      </Button>

      <div className={styles.login_signup_link}>
        <div className={styles.login_signup_link__header}>
          Already registered?
        </div>
        <ButtonLink link="/login">Log in</ButtonLink>
      </div>

      {error && <div className={styles.error}>{error}</div>}
    </Form>
  );
};

export default SignupForm;
