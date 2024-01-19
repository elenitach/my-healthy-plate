import ButtonLink from "../ButtonLink/ButtonLink";
import styles from './Main.module.scss';

const Main = () => {
  return (
      <div className={styles.main}>
        <h1 className={styles.header}>
          Healthy plate - 
          <br />
          better life
        </h1>
        <div className={styles.text}>
          Plan your diet. Achieve nutrients goals. Make own recipes.
        </div>
        <ButtonLink
          className={styles.button}
          link='/signup'
          variant="primary"
        >
          Join us!
        </ButtonLink>
      </div>
  );
}

export default Main;