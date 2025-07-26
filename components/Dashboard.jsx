"use client"

import { useState } from "react"
import { useSelector } from "react-redux"
import Sidebar from "./Sidebar"
import LiveVoting from "./LiveVoting"
import Analytics from "./Analytics"
import MemberManagement from "./MemberManagement"
import BillManagement from "./BillManagement"
import VotingHistory from "./VotingHistory"
import BillDetails from "./BillDetails"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const { user } = useSelector((state) => state.auth)
  const [viewingBillId, setViewingBillId] = useState(null)

  const renderContent = () => {
    if (viewingBillId) {
      return <BillDetails billId={viewingBillId} onBack={() => setViewingBillId(null)} />
    }

    switch (activeTab) {
      case "dashboard":
        return <Analytics onViewBill={setViewingBillId} />
      case "live-voting":
        return <LiveVoting onViewBill={setViewingBillId} />
      case "history":
        return <VotingHistory onViewBill={setViewingBillId} />
      case "members":
        return <MemberManagement />
      case "bills":
        return <BillManagement onViewBill={setViewingBillId} />
      default:
        return <Analytics onViewBill={setViewingBillId} />
    }
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col">
        <header className="bg-slate-700 text-white p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">PARLIAMENTARIANS E-VOTING SYSTEM</h1>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-500 rounded-full flex items-center justify-center">
              {user?.name?.charAt(0) || "U"}
            </div>
            <span>{user?.name || "User"}</span>
          </div>
        </header>
        <main className="flex-1 overflow-auto">{renderContent()}</main>
      </div>
    </div>
  )
}
