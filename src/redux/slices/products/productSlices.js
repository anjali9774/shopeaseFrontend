import axios from "axios";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import baseURL from "../../../utils/baseURL";
import { resetErrAction, resetSuccessAction } from "../globalActions/globalActions";
const instance = axios.create({
  baseURL,
});
const initialState = {
  products: [],
  product: {},
  loading: false,
  error: null,
  isAdded: false,
  isUpdated: false,
  isDelete: false,
};
//create product action
export const createProductAction = createAsyncThunk(
  "product/create",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    console.log(payload);
    try {
      const {
        name,
        description,
        category,
        sizes,
        brand,
        colors,
        price,
        totalQty,
        files,
      } = payload;
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };
      //FormData
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);

      formData.append("brand", brand);
      formData.append("price", price);
      formData.append("totalQty", totalQty);

      sizes.forEach((size) => {
        formData.append("sizes", size);
      });
      colors.forEach((color) => {
        formData.append("colors", color);
      });

      files.forEach((file) => {
        formData.append("files", file);
      });

      const { data } = await axios.post(
        `${baseURL}/products/createproduct`,
        formData,
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);
export const updateProductAction = createAsyncThunk(
  "product/update",
  async (payload, { rejectWithValue, getState }) => {
    try {
      const { data } = await axios.put(`${baseURL}/products/${payload.id}`, payload);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//fetch products action
export const fetchProductsAction = createAsyncThunk(
  "product/list",
  async ({ url }, { rejectWithValue, getState, dispatch }) => {
    console.log(url);
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(`${url}`, config);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);


//fetch product action
export const fetchProductAction = createAsyncThunk(
  "product/details",
  async (productId, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(
        `${baseURL}/products/${productId}`,
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);
export const deleteProductAction = createAsyncThunk(
  "product/delete",
  async (productId, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.delete(
        `${baseURL}/products/${productId}`,
        config
      );
      console.log("Deleted product:", response.data); // Add console.log here
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);



const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    
  builder
    .addCase(createProductAction.pending, (state) => {
       state.loading = true;
     })
     .addCase(createProductAction.fulfilled, (state, action) => {
      state.loading = false;
      state.products.push(action.payload); // Assuming action.payload is the newly created product
      state.isAdded = true;
    })
    .addCase(createProductAction.rejected, (state, action) => {
       state.loading = false;
       state.error = action.payload;
       state.isAdded = false;
     })
      .addCase(updateProductAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProductAction.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
        state.isUpdated = true;
      })
      .addCase(updateProductAction.rejected, (state, action) => {
        state.loading = false;
        state.product = null;
        state.isUpdated = false;
        state.error = action.payload;
      })
      .addCase(fetchProductsAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductsAction.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.isAdded = true;
      })
      .addCase(fetchProductsAction.rejected, (state, action) => {
        state.loading = false;
        state.products = [];
        state.isAdded = false;
        state.error = action.payload;
      })
      .addCase(fetchProductAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductAction.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
        state.isAdded = true;
      })
      .addCase(fetchProductAction.rejected, (state, action) => {
        state.loading = false;
        state.product = null;
        state.isAdded = false;
        state.error = action.payload;
      })
      .addCase(deleteProductAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProductAction.fulfilled, (state, action) => {
        state.loading = false;
        // Assuming the deleted product is removed from the products array
        state.products = state.products.filter(product => product.id !== action.payload.id);
        state.isDelete = true;
      })
      .addCase(deleteProductAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isDelete = false;
      })
      .addCase(resetErrAction.pending, (state, action) => {
        state.error = null;
      })
      .addCase(resetSuccessAction.pending, (state, action) => {
        state.isAdded = false;
        state.isUpdated = false;
      });
  },
});

const productReducer = productSlice.reducer;
export default productReducer;
