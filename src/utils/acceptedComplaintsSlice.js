import { createSlice } from "@reduxjs/toolkit";

const acceptedComplaintsSlice = createSlice({
  name: "acceptedComplaints",
  initialState: [],
  reducers: {
    addaccComplaints: (state, action) => action.payload,
    removeaccComplaints: () => null,
  },
});

export const { addaccComplaints, removeaccComplaints } =
  acceptedComplaintsSlice.actions;

export default acceptedComplaintsSlice.reducer;
