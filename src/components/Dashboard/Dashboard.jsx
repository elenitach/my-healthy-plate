import styles from "./Dashboard.module.css";
import RecipesContainer from "../RecipesContainer/RecipesContainer";
import Recipe from "../Recipe/Recipe";
import ButtonLink from "../ButtonLink/ButtonLink";
import Calendar from "moedim";
import cn from "classnames";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRecipes,
  selectRecipes,
  selectRecipesStatus,
} from "../../redux/recipes/recipesSlice";
import { useEffect, useState } from "react";
import { selectUser } from "../../redux/user/userSlice";
import ProductsTable from "../ProductsTable/ProductsTable";
import {
  fetchProducts,
  selectProducts,
  selectProductsStatus,
} from "../../redux/products/productsSlice";
import { getAgeFromBirthdate } from "../../utils/converters";
import Chart from "../Chart/Chart";
import {
  BMR,
  carbohydratesInGramsFromEnergy,
  fatsInGramsFromEnergy,
  getEnergyFromActivityLevel,
  proteinsInGramsFromEnergy,
} from "../../utils/equations";
import { Spinner } from "react-bootstrap";

const Dashboard = () => {
  const dispatch = useDispatch();

  const recipes = useSelector(selectRecipes);
  const recipesStatus = useSelector(selectRecipesStatus);
  const user = useSelector(selectUser);
  const products = useSelector(selectProducts);
  const productsStatus = useSelector(selectProductsStatus);

  const [buttonText, setButtonText] = useState("");
  const [date, setDate] = useState(new Date(new Date().setHours(0, 0, 0, 0)));
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (recipesStatus === "idle") {
      dispatch(fetchRecipes(user.id));
    } else if (recipesStatus === "succeeded" && recipes.length === 0) {
      setButtonText("Add your first recipe!");
    } else if (recipesStatus !== "loading") {
      setButtonText("New recipe");
    }
  }, [dispatch, recipesStatus, user, recipes]);

  useEffect(() => {
    dispatch(fetchProducts({ userId: user.id, date }));
  }, [dispatch, user, date]);

  useEffect(() => {
    const bmr = BMR(
      user.isMale,
      getAgeFromBirthdate(new Date(user.birthDate)),
      user.height,
      user.weight
    );
    const totalEnergy =
      getEnergyFromActivityLevel(user.activityLevel, bmr) + bmr;

    const [
      proteinsConsumed,
      fatsConsumed,
      carbohydratesConsumed,
      energyConsumed,
    ] = ["proteins", "fats", "carbohydrates", "energy"].map((category) =>
      products.map((p) => p[category]).reduce((sum, elem) => sum + elem, 0)
    );

    setChartData([
      {
        macronutrientType: "proteins",
        consumed: proteinsConsumed,
        left: Math.max(
          0,
          proteinsInGramsFromEnergy(totalEnergy) - proteinsConsumed
        ),
      },
      {
        macronutrientType: "fats",
        consumed: fatsConsumed,
        left: Math.max(0, fatsInGramsFromEnergy(totalEnergy) - fatsConsumed),
      },
      {
        macronutrientType: "carbohydrates",
        consumed: carbohydratesConsumed,
        left: Math.max(
          0,
          carbohydratesInGramsFromEnergy(totalEnergy) - carbohydratesConsumed
        ),
      },
      {
        macronutrientType: "energy",
        consumed: energyConsumed,
        left: Math.max(0, totalEnergy - energyConsumed),
      },
    ]);
  }, [products, user]);

  const handleDateChange = (value) => {
    setDate(value);
  };

  return (
    <main>
      <RecipesContainer>
        <ButtonLink link={"/add_recipe"} variant="addRecipe">
          {buttonText}
        </ButtonLink>
        {recipes.slice(0, 2).map((recipe) => (
          <Recipe
            key={recipe.id}
            id={recipe.id}
            title={recipe.title}
            difficulty={recipe.difficulty}
            timeInMinutes={recipe.time}
            cover={recipe.cover}
          />
        ))}
      </RecipesContainer>
      <section class="flex-wrapper">
        <div className={styles.statistics}>
          <h3 className={styles.statistics__header}>Macronutrient targets</h3>
          <div className={cn(styles.statistics__data, styles.macronutrients)}>
            {productsStatus === "loading" ? (
              <div className={styles.chartSpinnerWrapper}>
                <Spinner />
              </div>
            ) : (
              <Chart data={chartData} />
            )}
          </div>
        </div>
        <Calendar
          className={cn(
            styles.statistics,
            styles.statistics__data,
            styles.calendar
          )}
          value={date}
          onChange={handleDateChange}
        />
      </section>
      <div className={styles.statistics}>
        <h3 className={styles.statistics__header}>
          <span>Today`s products</span>
          {productsStatus === "loading" && (
            <Spinner className={styles.headerSpinner} size="sm" />
          )}
        </h3>

        <div className={cn(styles.statistics__data, styles.table)}>
          <ProductsTable date={date} />
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
