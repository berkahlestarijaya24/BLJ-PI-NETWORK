// features/generalReducer.js
import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  user: null, // Example of global state
  token: null, // Another example (could be 'light' or 'dark')
}

const generalReducer = createSlice({
  name: "general",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
    },
    setToken: (state, action) => {
      state.token = action.payload
    },
  },
})

export const { setUser, setToken } = generalReducer.actions
export default generalReducer.reducer
