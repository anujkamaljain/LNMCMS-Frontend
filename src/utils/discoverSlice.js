import { createSlice } from "@reduxjs/toolkit";

const discoverSlice = createSlice({
  name: "discover",
  initialState: {
    complaints: [],
    loading: false,
    error: null,
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
      state.complaints = action.payload;
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
    clearComplaints: (state) => {
      state.complaints = [];
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setComplaints,
  updateComplaintUpvote,
  clearComplaints,
} = discoverSlice.actions;

export default discoverSlice.reducer;
