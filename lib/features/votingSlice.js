import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  bills: [],
  votes: [],
  currentBill: null,
  loading: false,
}

// Load data from localStorage
if (typeof window !== "undefined") {
  const savedBills = localStorage.getItem("bills")
  const savedVotes = localStorage.getItem("votes")

  if (savedBills) {
    initialState.bills = JSON.parse(savedBills)
  } else {
    // Initialize with default bills
    const defaultBills = [
      {
        id: 1,
        title: "Health Care Reform Act",
        description: "A bill to improve and expand access to affordable health care.",
        status: "active",
        category: "Health Care",
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        title: "Education Funding Bill",
        description: "Increase funding for public education systems.",
        status: "passed",
        category: "Education",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 3,
        title: "Infrastructure Investment Act",
        description: "Investment in roads, bridges, and public transportation.",
        status: "failed",
        category: "Infrastructure",
        createdAt: new Date(Date.now() - 172800000).toISOString(),
      },
      {
        id: 4,
        title: "Environmental Protection Bill",
        description: "Strengthen environmental regulations and protections.",
        status: "passed",
        category: "Environment",
        createdAt: new Date(Date.now() - 259200000).toISOString(),
      },
    ]
    localStorage.setItem("bills", JSON.stringify(defaultBills))
    initialState.bills = defaultBills
    initialState.currentBill = defaultBills.find((b) => b.status === "active")
  }

  if (savedVotes) {
    initialState.votes = JSON.parse(savedVotes)
  }
}

const votingSlice = createSlice({
  name: "voting",
  initialState,
  reducers: {
    addBill: (state, action) => {
      // Set any existing active bill to passed status before creating new one
      const existingActiveBill = state.bills.find((b) => b.status === "active")
      if (existingActiveBill) {
        existingActiveBill.status = "passed"
      }

      const newBill = {
        ...action.payload,
        id: Date.now(),
        status: "active", // Immediately active for voting
        createdAt: new Date().toISOString(),
      }

      // Add to beginning of array so it appears first
      state.bills.unshift(newBill)
      state.currentBill = newBill
      localStorage.setItem("bills", JSON.stringify(state.bills))
    },
    updateBill: (state, action) => {
      const index = state.bills.findIndex((b) => b.id === action.payload.id)
      if (index !== -1) {
        state.bills[index] = action.payload
        localStorage.setItem("bills", JSON.stringify(state.bills))
      }
    },
    setCurrentBill: (state, action) => {
      state.currentBill = action.payload
    },
    castVote: (state, action) => {
      const { billId, userId, vote } = action.payload
      const existingVoteIndex = state.votes.findIndex((v) => v.billId === billId && v.userId === userId)

      if (existingVoteIndex !== -1) {
        state.votes[existingVoteIndex].vote = vote
      } else {
        state.votes.push({
          id: Date.now(),
          billId,
          userId,
          vote,
          timestamp: new Date().toISOString(),
        })
      }
      localStorage.setItem("votes", JSON.stringify(state.votes))
    },
  },
})

export const { addBill, updateBill, setCurrentBill, castVote } = votingSlice.actions
export default votingSlice.reducer
