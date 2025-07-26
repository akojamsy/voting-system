import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  members: [],
  loading: false,
}

// Load members from localStorage
if (typeof window !== "undefined") {
  const savedMembers = localStorage.getItem("members")
  if (savedMembers) {
    initialState.members = JSON.parse(savedMembers)
  } else {
    // Initialize with some default members
    const defaultMembers = [
      {
        id: 1,
        name: "John Smith",
        party: "Democratic Party",
        constituency: "District 1",
        email: "john@parliament.gov",
      },
      {
        id: 2,
        name: "Sarah Johnson",
        party: "Republican Party",
        constituency: "District 2",
        email: "sarah@parliament.gov",
      },
      {
        id: 3,
        name: "Michael Brown",
        party: "Independent",
        constituency: "District 3",
        email: "michael@parliament.gov",
      },
    ]
    localStorage.setItem("members", JSON.stringify(defaultMembers))
    initialState.members = defaultMembers
  }
}

const membersSlice = createSlice({
  name: "members",
  initialState,
  reducers: {
    addMember: (state, action) => {
      const newMember = { ...action.payload, id: Date.now() }
      state.members.push(newMember)
      localStorage.setItem("members", JSON.stringify(state.members))
    },
    updateMember: (state, action) => {
      const index = state.members.findIndex((m) => m.id === action.payload.id)
      if (index !== -1) {
        state.members[index] = action.payload
        localStorage.setItem("members", JSON.stringify(state.members))
      }
    },
    deleteMember: (state, action) => {
      state.members = state.members.filter((m) => m.id !== action.payload)
      localStorage.setItem("members", JSON.stringify(state.members))
    },
  },
})

export const { addMember, updateMember, deleteMember } = membersSlice.actions
export default membersSlice.reducer
