import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
}

// Load user from localStorage on initialization
if (typeof window !== 'undefined') {
  const savedUser = localStorage.getItem('user')
  if (savedUser) {
    initialState.user = JSON.parse(savedUser)
    initialState.isAuthenticated = true
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true
    },
    loginSuccess: (state, action) => {
      state.user = action.payload
      state.isAuthenticated = true
      state.loading = false
      localStorage.setItem('user', JSON.stringify(action.payload))
    },
    loginFailure: (state) => {
      state.loading = false
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      // localStorage.removeItem("user")
      // localStorage.removeItem("users")
      // localStorage.removeItem("members")
      // localStorage.removeItem("bills")
      // localStorage.removeItem("votes")
    },
    register: (state, action) => {
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      users.push(action.payload)
      localStorage.setItem('users', JSON.stringify(users))
    },
  },
})

export const { loginStart, loginSuccess, loginFailure, logout, register } =
  authSlice.actions
export default authSlice.reducer
