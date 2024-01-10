import styles from "./AuthForm.module.css";

const AuthForm = ({ children, onSubmit }) => {
  return (
    <form className={styles.form} onSubmit={onSubmit}>
      {children}
    </form>
  );
};

export default AuthForm;
