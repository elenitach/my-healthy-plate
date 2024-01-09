import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addDoc, collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebaseConfig";

const initialState = {
  items: [],
  status: 'idle'
};

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  extraReducers(builder) {
    builder
      .addCase('user/logout', (state, action) => {
        return initialState;
      })
      .addCase(fetchProducts.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded'
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      })
  }
});

export const fetchProducts = createAsyncThunk('products/fetchProducts', (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const q = query(
        collection(db, "products"),
        where("userId", "==", data.userId),
        where('date', "==", data.date)
      );
      const querySnapshot = await getDocs(q);
      const products = [];
      querySnapshot.forEach(doc => {
        products.push({id: doc.id, ...doc.data()});
      });
      resolve(products.sort((p1, p2) => p1.timestamp - p2.timestamp));
    } catch(err) {
      console.error(err);
      reject(err);
    }
  });
});

export const addProduct = createAsyncThunk('products/addProduct', (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const docRef = await addDoc(collection(db, 'products'), data);
      resolve({id: docRef.id, ...data });
    } catch(err) {
      reject(err);
    }
  });
});

export const deleteProduct = createAsyncThunk('products/deleteProduct', (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      await deleteDoc(doc(db, 'products', id));
      resolve(id);
    } catch(err) {
      reject(err);
    }
  })
})

export const selectProducts = (state) => state.products.items;
export const selectProductsStatus = (state) => state.products.status;

export default productsSlice.reducer;
