"use client"

import { useSelector } from "react-redux"
import LoginForm from "../components/LoginForm"
import Dashboard from "../components/Dashboard"

export default function Home() {
  const { isAuthenticated } = useSelector((state) => state.auth)

  return <main className="min-h-screen bg-slate-100">{isAuthenticated ? <Dashboard /> : <LoginForm />}</main>
}
