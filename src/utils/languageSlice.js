import { createSlice } from "@reduxjs/toolkit";

const languageSlice = createSlice({
  name: "language",
  initialState: {
    language: localStorage.getItem("language") || "en",
  },
  reducers: {
    setLanguage(state, action) {
      state.language = action.payload;
      localStorage.setItem("language", action.payload);
    },
    toggleLanguage(state) {
      const newLanguage = state.language === "en" ? "hi" : "en";
      state.language = newLanguage;
      localStorage.setItem("language", newLanguage);
    },
  },
});

export const { setLanguage, toggleLanguage } = languageSlice.actions;
export default languageSlice.reducer;
