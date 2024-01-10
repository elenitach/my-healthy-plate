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
  const [isProductAdding, setIsProductAdding] = useState(false);
  const [isRowDeleting, setIsRowDeleting] = useState(
    new Array(products.length).fill(false)
  );

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

  const handleAcceptClick = async (item) => {
    try {
      setIsProductAdding(true);
      await dispatch(
        addProduct({ ...item, userId: user.id, timestamp: new Date(), date })
      ).unwrap();
      setIsRowAdding(false);
      setIsRowDeleting(new Array(products.length + 1).fill(false));
    } catch (err) {
      console.log(err);
    } finally {
      setIsProductAdding(false);
    }
  };

  const handleRemoveClick = async (productId, index) => {
    try {
      setIsRowDeleting(
        isRowDeleting
          .slice(0, index)
          .concat(true, ...isRowDeleting.slice(index + 1))
      );
      await dispatch(deleteProduct(productId)).unwrap();
    } catch (err) {
      console.log(err);
    } finally {
      setIsRowDeleting(new Array(products.length - 1).fill(false));
    }
  };

  return (
    <>
      <table className={styles.table}>
        <thead>
          <ProductsTableRow isHeader data={headerData} />
        </thead>
        <tbody>
          {currentProducts.map((item, index) => (
            <ProductsTableRow
              key={item.id}
              data={item}
              index={index}
              handleRemoveClick={() => handleRemoveClick(item.id, index)}
              isRowDeleting={isRowDeleting[index]}
            />
          ))}
          {isRowAdding && (
            <ProductsTableRow
              isForm
              index={products.length}
              handleCancelProductAdding={() => setIsRowAdding(false)}
              handleAcceptClick={handleAcceptClick}
              isProductAdding={isProductAdding}
            />
          )}
        </tbody>
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
