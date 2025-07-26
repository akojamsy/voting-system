import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./features/authSlice"
import membersReducer from "./features/membersSlice"
import votingReducer from "./features/votingSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    members: membersReducer,
    voting: votingReducer,
  },
})
