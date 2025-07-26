"use client"

import { useDispatch, useSelector } from "react-redux"
import { Button } from "@/components/ui/button"
import { BarChart3, Vote, History, Users, FileText, LogOut } from "lucide-react"
import { logout } from "../lib/features/authSlice"

export default function Sidebar({ activeTab, setActiveTab }) {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "live-voting", label: "Live Voting", icon: Vote },
    { id: "history", label: "History", icon: History },
  ]

  if (user?.role === "admin") {
    menuItems.push({ id: "members", label: "Members", icon: Users }, { id: "bills", label: "Bills", icon: FileText })
  }

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col">
      <div className="p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className={`w-full justify-start ${activeTab === item.id ? "bg-blue-600 text-white" : ""}`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            )
          })}
        </nav>
      </div>

      <div className="mt-auto p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}
