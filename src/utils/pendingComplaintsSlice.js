import { createSlice } from "@reduxjs/toolkit";

const pendingComplaintsSlice = createSlice({
  name: "pendingComplaints",
  initialState: [],
  reducers: {
    addComplaints: (state, action) => action.payload,
    appendComplaint: (state, action) => {
      state.push(action.payload);
    },
    removeComplaint: (state, action) => {
      const newArry = state.filter((c) => c._id !== action.payload);
      return newArry;
    },
    clearComplaints: () => []
  },
});

export const { addComplaints, removeComplaint, appendComplaint, clearComplaints} =
  pendingComplaintsSlice.actions;

export default pendingComplaintsSlice.reducer;
