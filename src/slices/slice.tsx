import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
export const getData = createAsyncThunk('orederData', async () => {});

interface IOrder {
  data: [];
}

const initialState: IOrder = {
  data: []
};

export const burgerSlice = createSlice({
  name: 'burger',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getData.pending, (state) => {})
      .addCase(getData.rejected, () => {})
      .addCase(getData.fulfilled, () => {});
  },
  selectors: {}
});
