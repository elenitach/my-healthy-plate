import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";
import { login } from "../../redux/user/userSlice";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Form from "../AuthForm/AuthForm";
import styles from "../AuthForm/AuthForm.module.css";
import cn from "classnames";
import Button from "../Button/Button";
import ButtonLink from "../ButtonLink/ButtonLink";
import { userDefaultData } from "../../utils/constants";
import { LOGIN_ERROR } from "../../utils/validators";
import clsx from "clsx";
import { Spinner } from "react-bootstrap";
import Error from "../Error/Error";

const LoginForm = () => {
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setError(null);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const userAuth = await signInWithEmailAndPassword(auth, email, password);
      try {
        const docSnap = await getDoc(doc(db, "users", userAuth.user.uid));
        const userData = docSnap.exists() ? docSnap.data() : userDefaultData;
        if (!docSnap.exists()) {
          await setDoc(doc(db, "users", userAuth.user.uid), userData);
        }
        dispatch(
          login({
            email: userAuth.user.email,
            id: userAuth.user.uid,
            ...userData,
          })
        );
        setError(null);
        navigate("/dashboard");
      } catch (err) {
        console.log(err);
        signOut(auth);
      }
    } catch (err) {
      if (
        err.code === "auth/wrong-password" ||
        err.code === "auth/user-not-found"
      )
        setError(LOGIN_ERROR);
      console.log(err.code);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h2 className={styles.form__header}>Welcome back!</h2>

      <div className={styles.form__item}>
        Email{error && <Error message={error} placement="right" />}
      </div>
      <input
        type="email"
        className={clsx(styles.input, styles.form__item, {
          [styles.errorInput]: error,
        })}
        placeholder="Email address"
        required
        value={email}
        onChange={handleEmailChange}
      />

      <div className={styles.form__item}>Password</div>
      <input
        type="password"
        className={clsx(styles.input, styles.form__item, {
          [styles.errorInput]: error,
        })}
        placeholder="Password"
        required
        value={password}
        onChange={handlePasswordChange}
      />

      <Button
        className={styles.form__button}
        variant="primary"
        disabled={loading}
      >
        LOG IN
        {loading && <Spinner className={styles.buttonSpinner} size="sm" />}
      </Button>

      <div className={styles.login_signup_link}>
        <div className={styles.login_signup_link__header}>
          Don`t have an account?
        </div>
        <ButtonLink link="/signup">Sign up</ButtonLink>
      </div>
    </Form>
  );
};

export default LoginForm;
