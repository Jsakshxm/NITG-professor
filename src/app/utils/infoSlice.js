import { createSlice } from "@reduxjs/toolkit";

const infoSlice = createSlice({
  name: "info",
  initialState: {
    info: null,
  },
  reducers: {
    addinfo: (state, action) => {
      return action.payload;
    },
  },
});

export const { addinfo } = infoSlice.actions;
export default infoSlice.reducer;
