import { useSelector } from "react-redux";
import ButtonLink from "../ButtonLink/ButtonLink";
import Recipe from "../Recipe/Recipe";
import RecipesContainer from "../RecipesContainer/RecipesContainer";
import { selectRecipes } from "../../redux/recipes/recipesSlice";
import styles from './Recipes.module.css';
import { useState } from "react";

const Recipes = () => {
  const recipes = useSelector(selectRecipes);
  const [currentDifficulty, setCurrentDifficulty] = useState(0);

  const handleDifficultyChange = (event) => {
    setCurrentDifficulty(parseInt(event.target.value));
  }

  return (
    <>
    <h4 className={styles.filter__header}>Filter by difficulty</h4>
    <select className={styles.filter__select} value={currentDifficulty} onChange={handleDifficultyChange}>
      <option value={0}>
        all
      </option>
      <option value={1}>
        easy
      </option>
      <option value={2}>
        medium
      </option>
      <option value={3}>
        hard
      </option>
    </select>
    <RecipesContainer>
      <ButtonLink link={'/add_recipe'} variant="addRecipe">
        New
      </ButtonLink>
      {
        recipes
        .filter(recipe => recipe.difficulty === currentDifficulty || currentDifficulty === 0)
        .map(recipe => (
          <Recipe 
            key={recipe.id} 
            id={recipe.id}
            title={recipe.title}
            difficulty={recipe.difficulty}
            timeInMinutes={recipe.time}
            cover={recipe.cover}
          />
        ))
      }
    </RecipesContainer>
    </>
  );
}

export default Recipes;