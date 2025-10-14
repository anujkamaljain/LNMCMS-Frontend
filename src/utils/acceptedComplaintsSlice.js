import { createSlice } from "@reduxjs/toolkit";

const acceptedComplaintsSlice = createSlice({
  name: "acceptedComplaints",
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
    addaccComplaints: (state, action) => {
      state.complaints = action.payload.complaints || action.payload;
      if (action.payload.pagination) {
        state.pagination = action.payload.pagination;
      }
    },
    removeaccComplaint: (state, action) => {
      state.complaints = state.complaints.filter((c) => c._id !== action.payload);
      state.pagination.totalComplaints = Math.max(0, state.pagination.totalComplaints - 1);
      state.pagination.totalPages = Math.ceil(state.pagination.totalComplaints / state.pagination.limit);
    },
    removeaccComplaints: (state) => {
      state.complaints = [];
      state.pagination = {
        currentPage: 1,
        totalPages: 1,
        totalComplaints: 0,
        limit: 12
      };
    },
    setaccPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    }
  },
});

export const { addaccComplaints, removeaccComplaints, removeaccComplaint, setaccPagination } =
  acceptedComplaintsSlice.actions;

export default acceptedComplaintsSlice.reducer;
