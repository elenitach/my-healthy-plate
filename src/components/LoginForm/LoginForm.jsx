import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";
import { login } from "../../redux/user/userSlice";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Form from '../Form/Form';
import styles from '../Form/Form.module.css';
import cn from 'classnames';
import Button from "../Button/Button";
import ButtonLink from "../ButtonLink/ButtonLink";

const LoginForm = () => {
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const userAuth = await signInWithEmailAndPassword(auth, email, password);
      try {
        const docSnap = await getDoc(doc(db, 'users', userAuth.user.uid));
        const userData = docSnap.exists() ? docSnap.data() : {
          name: 'user',
          isMale: true,
          birthDate: '2000.01.01',
          height: 170,
          weight: 60
        };
        if (!docSnap.exists()) {
          await setDoc(doc(db, 'users', userAuth.user.uid), userData);
        }
        dispatch(login({
          email: userAuth.user.email,
          id: userAuth.user.uid,
          ...userData
        }));
        setError('');
        navigate('/dashboard');
      } catch(err) {
        console.log(err);
        setError('An error ocurred');
        signOut(auth);
      }
    } catch(err) {
      setError('Invalid email or password');
    };
    setLoading(false);
  }

  return (
      <Form onSubmit={handleSubmit}>
        <h2 className={styles.form__header}>
          Welcome back!
        </h2>

        <div className={styles.form__item}>Email</div>
        <input 
          type="email" 
          className={cn(styles.input, styles.form__item)}
          placeholder="Email address" 
          required 
          value={email}
          onChange={handleEmailChange}
        />

        <div className={styles.form__item}>Password</div>
        <input 
          type="password" 
          className={cn(styles.input, styles.form__item)}
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
        </Button>

        <div className={styles.login_signup_link}>
          <div className={styles.login_signup_link__header}>Don`t have an account?</div> 
          <ButtonLink link="/signup">Sign up</ButtonLink>
        </div>

        { error && <div className={styles.error}>{ error }</div> }
      </Form>
  );
}

export default LoginForm;