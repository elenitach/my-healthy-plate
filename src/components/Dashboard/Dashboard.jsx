import styles from './Dashboard.module.css';
import RecipesContainer from '../RecipesContainer/RecipesContainer';
import Recipe from '../Recipe/Recipe';
import ButtonLink from '../ButtonLink/ButtonLink';
import Calendar from 'moedim';
import cn from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecipes, selectRecipes, selectRecipesStatus } from '../../redux/recipes/recipesSlice';
import { useEffect, useState } from 'react';
import { selectUser } from '../../redux/user/userSlice';
import ProductsTable from '../ProductsTable/ProductsTable';
import { changeDate, fetchProducts, selectDate, selectProducts, selectProductsStatus } from '../../redux/products/productsSlice';
import { dateToString, getAgeFromBirthdate } from '../../utils/converters';
import Chart from '../Chart/Chart';
import { BMR, carbohydratesInGramsFromEnergy, fatsInGramsFromEnergy, getEnergyFromActivityLevel, proteinsInGramsFromEnergy } from '../../utils/equations';

const Dashboard = () => {
  const dispatch = useDispatch();
  const recipes = useSelector(selectRecipes);
  const recipesStatus = useSelector(selectRecipesStatus);
  const user = useSelector(selectUser);
  const productsDate = useSelector(selectDate);
  const products = useSelector(selectProducts);
  const productsStatus = useSelector(selectProductsStatus);
  const [buttonText, setButtonText] = useState('');
  const [date, setDate] = useState(productsDate ? new Date(productsDate) : new Date());
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (recipesStatus === 'idle') {
      dispatch(fetchRecipes(user.id));
    } else if (recipesStatus === 'succeeded' && recipes.length === 0) {
      setButtonText('Add your first recipe!');
    } else if (recipesStatus !== 'loading') {
      setButtonText('New recipe');
    }
    if (productsStatus === 'idle') {
      dispatch(changeDate(dateToString(date)));
      dispatch(fetchProducts({userId: user.id, date: dateToString(date)}));
    } 
  }, [recipesStatus, productsStatus, products, date, dispatch, user.id, recipes.length]);

  useEffect(() => {
    const bmr = BMR(user.isMale, getAgeFromBirthdate(new Date(user.birthDate)), user.height, user.weight);
    const totalEnergy = getEnergyFromActivityLevel(user.activityLevel, bmr) + bmr;
    const proteinsConsumed = 
      products.map(p => p.proteins).reduce((sum, elem) => sum + elem, 0); 
    const fatsConsumed = 
      products.map(p => p.fats).reduce((sum, elem) => sum + elem, 0);
    const carbohydratesConsumed = 
      products.map(p => p.carbohydrates).reduce((sum, elem) => sum + elem, 0);
    const energyConsumed = 
      products.map(p => p.energy).reduce((sum, elem) => sum + elem, 0);
    
    setChartData([
      {
        macronutrientType: 'proteins',
        consumed: proteinsConsumed,
        left: Math.max(proteinsInGramsFromEnergy(totalEnergy) - proteinsConsumed)
      },
      {
        macronutrientType: 'fats',
        consumed: fatsConsumed,
        left: Math.max(fatsInGramsFromEnergy(totalEnergy) - fatsConsumed)
      },
      {
        macronutrientType: 'carbohydrates',
        consumed: carbohydratesConsumed,
        left: Math.max(0, carbohydratesInGramsFromEnergy(totalEnergy) - carbohydratesConsumed)
      },
      {
        macronutrientType: 'energy',
        consumed: energyConsumed,
        left: Math.max(totalEnergy - energyConsumed)
      }
    ]);
  }, [products, user.birthDate, user.activityLevel, user.height, user.weight, user.isMale]);

  const handleDateChange = (value) => {
    setDate(value);
    dispatch(changeDate(dateToString(value)));
    dispatch(fetchProducts({userId: user.id, date: dateToString(value)}));
  }

  return (
      <main>
        <RecipesContainer>
          <ButtonLink link={'/add_recipe'} variant="addRecipe">
            {buttonText}
          </ButtonLink>
          {
            recipes.slice(0, 2).map(recipe => (
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
        <section class="flex-wrapper">
          <div className={styles.statistics}>
            <h3 className={styles.statistics__header}>Macronutrient targets</h3>
            <div className={cn(styles.statistics__data, styles.macronutrients)}>
              <Chart data={chartData} />
            </div>
          </div>
          <Calendar 
            className={cn(styles.statistics, styles.statistics__data, styles.calendar)} 
            value={date} 
            onChange={handleDateChange} 
          />
        </section>
        <div className={styles.statistics}>
          <h3 className={styles.statistics__header}>Today`s products</h3>
          <div className={cn(styles.statistics__data, styles.table)}>
            <ProductsTable products={products} />
          </div>
        </div>
      </main>
  );
}

export default Dashboard;