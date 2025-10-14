import { createSlice } from "@reduxjs/toolkit";

const resolvedComplaintsSlice = createSlice({
  name: "resolvedComplaints",
  initialState: {
    complaints: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalComplaints: 0,
      limit: 12
    }
  },
  reducers: {
    addresComplaints: (state, action) => {
      state.complaints = action.payload.complaints || action.payload;
      if (action.payload.pagination) {
        state.pagination = action.payload.pagination;
      }
    },
    removeresComplaint: (state) => {
      state.complaints = [];
      state.pagination = {
        currentPage: 1,
        totalPages: 1,
        totalComplaints: 0,
        limit: 12
      };
    },
    setresPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    }
  },
});

export const { addresComplaints, removeresComplaint, setresPagination } = resolvedComplaintsSlice.actions;

export default resolvedComplaintsSlice.reducer;
