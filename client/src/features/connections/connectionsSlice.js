import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  followers: [],
  following: [],
  pendingFollow: [],
};

const connectionsSlice = createSlice({
  name: "connections",
  initialState,
  reducers: {},
});

export default connectionsSlice.reducer;
