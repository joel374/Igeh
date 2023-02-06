import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  id: 0,
  username: "",
  email: "",
  // role: "",
  profile_picture_url: "",
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.id = action.payload.id
      state.username = action.payload.username
      state.email = action.payload.email
      // state.role = action.payload.role
      state.profile_picture_url = action.payload.profile_picture_url
    },
    logout: (state) => {
      state.id = 0
      state.username = ""
      // state.role = ""
      state.email = ""
      state.profile_picture_url = ""
    },
  },
})

export const { login, logout } = authSlice.actions

export default authSlice.reducer
