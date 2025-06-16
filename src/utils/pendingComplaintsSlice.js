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
    clearComplaints: () => null
  },
});

export const { addComplaints, removeComplaint, clearComplaints} =
  pendingComplaintsSlice.actions;

export default pendingComplaintsSlice.reducer;
