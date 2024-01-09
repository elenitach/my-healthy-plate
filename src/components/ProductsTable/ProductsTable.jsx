import { useEffect, useState } from "react";
import ProductsTableRow from "../ProductsTableRow/ProductsTableRow";
import styles from "./ProductsTable.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  addProduct,
  deleteProduct,
  selectProducts,
} from "../../redux/products/productsSlice";
import { selectUser } from "../../redux/user/userSlice";
import IconButton from "../IconButton/IconButton";
import PlusIcon from "../Icons/PlusIcon";

const ProductsTable = ({ date }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const products = useSelector(selectProducts);
  const productsStatus = useSelector((state) => state.products.status);
  const [isRowAdding, setIsRowAdding] = useState(false);
  const [currentProducts, setCurrentProducts] = useState([...products]);

  useEffect(() => {
    if (productsStatus === "loading") {
      setCurrentProducts([]);
    } else {
      setCurrentProducts([...products]);
    }
  }, [productsStatus, products]);

  const headerData = {
    title: "product",
    weight: "weight (g)",
    proteins: "proteins (g)",
    fats: "fats (g)",
    carbohydrates: "carbs (g)",
    energy: "energy (kcal)",
  };

  const handleAddClick = () => {
    if (isRowAdding) return;
    setIsRowAdding(true);
  };

  const handleAcceptClick = (item) => {
    setIsRowAdding(false);
    setCurrentProducts([...currentProducts, item]);
    dispatch(
      addProduct({ ...item, userId: user.id, timestamp: new Date(), date })
    );
  };

  const handleRemoveClick = (productId) => {
    setCurrentProducts(currentProducts.filter((item) => item.id !== productId));
    dispatch(deleteProduct(productId));
  };

  return (
    <>
      <table className={styles.table}>
        <ProductsTableRow isHeader data={headerData} />
        {currentProducts.map((item, index) => (
          <ProductsTableRow
            key={item.id}
            data={item}
            index={index}
            handleRemoveClick={handleRemoveClick}
          />
        ))}
        {isRowAdding && (
          <ProductsTableRow
            isForm
            index={products.length}
            handleCancelProductAdding={() => setIsRowAdding(false)}
            handleAcceptClick={handleAcceptClick}
          />
        )}
      </table>
      <IconButton
        className={styles.buttonAdd}
        onClick={handleAddClick}
        icon={<PlusIcon />}
      />
    </>
  );
};

export default ProductsTable;
