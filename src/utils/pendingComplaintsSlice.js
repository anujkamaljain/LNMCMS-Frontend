import { createSlice } from "@reduxjs/toolkit";

const pendingComplaintsSlice = createSlice({
  name: "pendingComplaints",
  initialState: [],
  reducers: {
    addComplaints: (state, action) => action.payload,
    removeComplaint: (state, action) => {
      const newArry = state.filter((c) => c._id !== action.payload);
      return newArry;
    },
  },
});

export const { addComplaints, removeComplaint } =
  pendingComplaintsSlice.actions;

export default pendingComplaintsSlice.reducer;
