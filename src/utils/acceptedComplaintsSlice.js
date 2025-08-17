import { createSlice } from "@reduxjs/toolkit";

const acceptedComplaintsSlice = createSlice({
  name: "acceptedComplaints",
  initialState: [],
  reducers: {
    addaccComplaints: (state, action) => action.payload,
    removeaccComplaint: (state, action) => {
      const newArry = state.filter((c) => c._id !== action.payload);
      return newArry;
    },
    removeaccComplaints: () => null,
  },
});

export const { addaccComplaints, removeaccComplaints, removeaccComplaint } =
  acceptedComplaintsSlice.actions;

export default acceptedComplaintsSlice.reducer;
