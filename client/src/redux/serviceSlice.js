import { createSlice } from "@reduxjs/toolkit";

export const serviceSlice = createSlice({
  name: "services",
  initialState: {
    user: null
  },
  reducers: {
    setService: (state , action) => {
      state.service = action.payload;
    }
  },
});

export const { setService , reloadServiceData } = serviceSlice.actions;