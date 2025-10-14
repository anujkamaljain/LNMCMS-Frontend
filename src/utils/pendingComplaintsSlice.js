import { createSlice } from "@reduxjs/toolkit";

const pendingComplaintsSlice = createSlice({
  name: "pendingComplaints",
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
    addComplaints: (state, action) => {
      state.complaints = action.payload.complaints || action.payload;
      if (action.payload.pagination) {
        state.pagination = action.payload.pagination;
      }
    },
    appendComplaint: (state, action) => {
      state.complaints.push(action.payload);
      state.pagination.totalComplaints += 1;
      state.pagination.totalPages = Math.ceil(state.pagination.totalComplaints / state.pagination.limit);
    },
    removeComplaint: (state, action) => {
      state.complaints = state.complaints.filter((c) => c._id !== action.payload);
      state.pagination.totalComplaints = Math.max(0, state.pagination.totalComplaints - 1);
      state.pagination.totalPages = Math.ceil(state.pagination.totalComplaints / state.pagination.limit);
    },
    clearComplaints: (state) => {
      state.complaints = [];
      state.pagination = {
        currentPage: 1,
        totalPages: 1,
        totalComplaints: 0,
        limit: 12
      };
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    }
  },
});

export const { addComplaints, removeComplaint, appendComplaint, clearComplaints, setPagination} =
  pendingComplaintsSlice.actions;

export default pendingComplaintsSlice.reducer;
