import { createSlice } from "@reduxjs/toolkit";

const ViewComplaintsSlice = createSlice({
  name: "ViewComplaints",
  initialState: [],
  reducers: {
    addingComplaints: (state, action) => action.payload,
    updatingStatus: (state, action) => {
      return state.map(complaint => {
        if(complaint._id === action.payload) {
          return { 
            ...complaint, 
            status: "resolved" 
          };
        }
        return complaint;
      });
    },
    removingComplaint: () => null,
  },
});

export const { addingComplaints, updatingStatus, removingComplaint } =
  ViewComplaintsSlice.actions;

export default ViewComplaintsSlice.reducer;
