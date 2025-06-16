import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./themeSlice";
import authReducer from "./authSlice";
import pendingReducer from "./pendingComplaintsSlice";
import acceptedReducer from "./acceptedComplaintsSlice";
import resolvedReducer from "./resolvedComplaintsSlice";
import viewComplaintsReducer from "./ViewComplaintsSlice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    pending: pendingReducer,
    accepted: acceptedReducer,
    resolved: resolvedReducer,
    view: viewComplaintsReducer,
  },
});
