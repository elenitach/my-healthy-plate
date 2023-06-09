import { useEffect, useState } from 'react';
import Button from '../Button/Button';
import ProductsTableRow from '../ProductsTableRow/ProductsTableRow';
import styles from './ProductsTable.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct, deleteProduct, selectDate } from '../../redux/products/productsSlice';
import { selectUser } from '../../redux/user/userSlice';

const ProductsTable = ({products}) => {
  const [isRowAdding, setIsRowAdding] = useState(false);
  const [currentProducts, setCurrentProducts] = useState([...products])
  const dispatch = useDispatch();
  const date = useSelector(selectDate);
  const user = useSelector(selectUser);

  useEffect(() => {
    setCurrentProducts([...products]);
  }, [products]);

  const headerData = {
    title: 'product', 
    count: 'count (g)', 
    proteins: 'proteins (g)', 
    fats: 'fats (g)',
    carbohydrates: 'carbs (g)',
    energy: 'energy (kcal)'
  };

  const handleAddClick = () => {
    if (isRowAdding) return;
    setIsRowAdding(true);

  }

  const handleAcceptClick = (item) => {
    setIsRowAdding(false);
    setCurrentProducts([...currentProducts, item]);
    dispatch(addProduct({...item, userId: user.id, date, timestamp: new Date()}));
  }

  const handleRemoveClick = (productId) => {
    setCurrentProducts(currentProducts.filter(item => item.id !== productId));
    dispatch(deleteProduct(productId));
  }

  return (
    <>
    <table className={styles.table}>
      <ProductsTableRow 
        isHeader
        data={headerData} 
      />
      {
      currentProducts.map(
        (item, index) => 
        <ProductsTableRow 
          key={item.id} 
          data={item} 
          index={index} 
          handleRemoveClick={handleRemoveClick} 
        />)
      }    
      {
      isRowAdding && 
      <ProductsTableRow 
        isForm 
        index={products.length} 
        handleCancelProductAdding={() => setIsRowAdding(false)} 
        handleAcceptClick={handleAcceptClick}
      />
      }
    </table>
    <Button className={styles.button_add} variant={{isCRUD: true, isAdd: true}} onClick={handleAddClick} />
    </>
  );
}

export default ProductsTable;