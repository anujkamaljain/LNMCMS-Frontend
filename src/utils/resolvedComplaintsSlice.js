import { createSlice } from "@reduxjs/toolkit";

const resolvedComplaintsSlice = createSlice({
  name: "resolvedComplaints",
  initialState: [],
  reducers: {
    addresComplaints: (state, action) => action.payload,
    removeresComplaint: () => null,
  },
});

export const { addresComplaints, removeresComplaint } = resolvedComplaintsSlice.actions;

export default resolvedComplaintsSlice.reducer;
