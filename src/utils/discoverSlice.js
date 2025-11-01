import { createSlice } from "@reduxjs/toolkit";

const discoverSlice = createSlice({
  name: "discover",
  initialState: {
    complaints: [],
    loading: false,
    error: null,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalComplaints: 0,
      limit: 12
    }
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setComplaints: (state, action) => {
      state.complaints = action.payload.complaints || action.payload;
      if (action.payload.pagination) {
        state.pagination = action.payload.pagination;
      }
      state.loading = false;
      state.error = null;
    },
    updateComplaintUpvote: (state, action) => {
      const { complaintId, upvoted, upvoteCount } = action.payload;
      const complaint = state.complaints.find(
        (comp) => comp._id === complaintId
      );
      if (complaint) {
        complaint.upvoteCount = upvoteCount;
      }
    },
    removeComplaint: (state, action) => {
      state.complaints = state.complaints.filter((c) => c._id !== action.payload);
      state.pagination.totalComplaints = Math.max(0, state.pagination.totalComplaints - 1);
      state.pagination.totalPages = Math.ceil(state.pagination.totalComplaints / state.pagination.limit);
    },
    clearComplaints: (state) => {
      state.complaints = [];
      state.loading = false;
      state.error = null;
      state.pagination = {
        currentPage: 1,
        totalPages: 1,
        totalComplaints: 0,
        limit: 12
      };
    },
  },
});

export const {
  setLoading,
  setError,
  setComplaints,
  updateComplaintUpvote,
  removeComplaint,
  clearComplaints,
} = discoverSlice.actions;

export default discoverSlice.reducer;
