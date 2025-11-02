import { createSlice } from "@reduxjs/toolkit";

const rejectedComplaintsSlice = createSlice({
  name: "rejectedComplaints",
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
    addrejComplaints: (state, action) => {
      state.complaints = action.payload.complaints || action.payload;
      if (action.payload.pagination) {
        state.pagination = action.payload.pagination;
      }
    },
    removerejComplaint: (state, action) => {
      state.complaints = state.complaints.filter((c) => c._id !== action.payload);
      state.pagination.totalComplaints = Math.max(0, state.pagination.totalComplaints - 1);
      state.pagination.totalPages = Math.ceil(state.pagination.totalComplaints / state.pagination.limit);
    },
    removerejComplaints: (state) => {
      state.complaints = [];
      state.pagination = {
        currentPage: 1,
        totalPages: 1,
        totalComplaints: 0,
        limit: 12
      };
    },
    setrejPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    }
  },
});

export const { addrejComplaints, removerejComplaints, removerejComplaint, setrejPagination } =
  rejectedComplaintsSlice.actions;

export default rejectedComplaintsSlice.reducer;

