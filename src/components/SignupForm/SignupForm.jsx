import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebaseConfig";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../redux/user/userSlice";
import { useDispatch } from "react-redux";
import {
  passwordIsValid,
  birthDateIsValid,
  weightIsValid,
  heightIsValid,
  INVALID_BIRTHDATE_ERROR_MESSAGE,
  INVALID_HEIGHT_ERROR_MESSAGE,
  INVALID_WEIGHT_ERROR_MESSAGE,
  INVALID_PASSWORD_ERROR_MESSAGE,
  INVALID_BMR_ERROR_MESSAGE,
  PASSWORDS_DO_NOT_MATCH_ERROR_MESSAGE,
  EXISTING_EMAIL_ERROR_MESSAGE,
} from "../../utils/validators";
import { doc, setDoc } from "firebase/firestore";
import AuthForm from "../AuthForm/AuthForm";
import styles from "../AuthForm/AuthForm.module.css";
import cn from "classnames";
import Button from "../Button/Button";
import ButtonLink from "../ButtonLink/ButtonLink";
import { BMR } from "../../utils/equations";
import { getAgeFromBirthdate } from "../../utils/converters";
import { userDefaultData } from "../../utils/constants";
import clsx from "clsx";
import { Spinner } from "react-bootstrap";
import Error from "../Error/Error";

const SignupForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isMale, setIsMale] = useState(userDefaultData.isMale);
  const [birthDate, setBirthDate] = useState(userDefaultData.birthDate);
  const [height, setHeight] = useState(userDefaultData.height);
  const [weight, setWeight] = useState(userDefaultData.weight);

  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState(null);
  const [birthDateError, setBirthDateError] = useState(null);
  const [heightError, setHeightError] = useState(null);
  const [weightError, setWeightError] = useState(null);
  const [bmrError, setBmrError] = useState(null);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setEmailError(null);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setPasswordError(
      passwordIsValid(event.target.value)
        ? null
        : INVALID_PASSWORD_ERROR_MESSAGE
    );
    setConfirmPasswordError(
      event.target.value === confirmPassword
        ? null
        : PASSWORDS_DO_NOT_MATCH_ERROR_MESSAGE
    );
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
    setConfirmPasswordError(
      event.target.value === password
        ? null
        : PASSWORDS_DO_NOT_MATCH_ERROR_MESSAGE
    );
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);

    let errorOcurred = passwordError || confirmPasswordError;

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
        const userAuth = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const nameToStore = name === "" ? userDefaultData.name : name;
        try {
          await setDoc(doc(db, "users", userAuth.user.uid), {
            name: nameToStore,
            isMale,
            birthDate,
            height: +height,
            weight: +weight,
            activityLevel: 2,
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
        if (err.code === "auth/email-already-in-use") {
          setEmailError(EXISTING_EMAIL_ERROR_MESSAGE);
        }
      }
    }
    setLoading(false);
  };

  return (
    <AuthForm onSubmit={handleSubmit}>
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
        {emailError && <Error message={emailError} placement="right" />}
      </div>
      <input
        type="email"
        className={clsx(styles.input, styles.form__item, {
          [styles.errorInput]: emailError,
        })}
        placeholder="Email address"
        required
        value={email}
        onChange={handleEmailChange}
      />

      <div className={styles.form__item}>
        Password <span className={styles.input_required}>*</span>
        {passwordError && <Error message={passwordError} placement="right" />}
      </div>
      <input
        type="password"
        className={clsx(styles.input, styles.form__item, {
          [styles.errorInput]: passwordError,
        })}
        placeholder="Password"
        required
        value={password}
        onChange={handlePasswordChange}
      />

      <div className={styles.form__item}>
        Confirm password <span className={styles.input_required}>*</span>
        {confirmPasswordError && (
          <Error message={confirmPasswordError} placement="right" />
        )}
      </div>
      <input
        type="password"
        className={clsx(styles.input, styles.form__item, {
          [styles.errorInput]: confirmPasswordError,
        })}
        placeholder="Password"
        required
        value={confirmPassword}
        onChange={handleConfirmPasswordChange}
      />

      <h3 className={styles.section__header}>
        Personal info
        {bmrError && <Error message={bmrError} placement="right" />}
      </h3>

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

      <Button
        className={styles.form__button}
        variant="primary"
        disabled={loading}
      >
        SIGN UP
        {loading && <Spinner className={styles.buttonSpinner} size="sm" />}
      </Button>

      <div className={styles.login_signup_link}>
        <div className={styles.login_signup_link__header}>
          Already registered?
        </div>
        <ButtonLink link="/login">Log in</ButtonLink>
      </div>
    </AuthForm>
  );
};

export default SignupForm;
