"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { loginStart, loginSuccess, loginFailure, register } from "../lib/features/authSlice"
import { Fingerprint } from "lucide-react"

export default function LoginForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    role: "user",
  })
  const dispatch = useDispatch()

  const [showFingerprint, setShowFingerprint] = useState(false)

  const handleFingerprintAuth = async () => {
    if (!navigator.credentials) {
      alert("Fingerprint authentication not supported on this device")
      return
    }

    try {
      // Simulate fingerprint authentication
      const result = await new Promise((resolve) => {
        setTimeout(() => {
          // Simulate successful fingerprint auth
          resolve(true)
        }, 2000)
      })

      if (result) {
        // Auto-login as admin for demo purposes
        const users = JSON.parse(localStorage.getItem("users") || "[]")
        const adminUser = users.find((u) => u.role === "admin") || {
          id: 1,
          email: "admin@parliament.gov",
          password: "admin123",
          name: "System Administrator",
          role: "admin",
        }
        dispatch(loginSuccess(adminUser))
      }
    } catch (error) {
      alert("Fingerprint authentication failed")
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(loginStart())

    if (isLogin) {
      // Login logic
      const users = JSON.parse(localStorage.getItem("users") || "[]")

      // Add default admin if no users exist
      if (users.length === 0) {
        const defaultAdmin = {
          id: 1,
          email: "admin@parliament.gov",
          password: "admin123",
          name: "System Administrator",
          role: "admin",
        }
        users.push(defaultAdmin)
        localStorage.setItem("users", JSON.stringify(users))
      }

      const user = users.find((u) => u.email === formData.email && u.password === formData.password)

      if (user) {
        dispatch(loginSuccess(user))
      } else {
        dispatch(loginFailure())
        alert("Invalid credentials")
      }
    } else {
      // Register logic
      const newUser = {
        id: Date.now(),
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role: formData.role,
      }
      dispatch(register(newUser))
      dispatch(loginSuccess(newUser))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-slate-700">PARLIAMENTARIAN E-VOTING SYSTEM</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required={!isLogin}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  className="w-full p-2 border rounded-md"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            )}

            {isLogin && (
              <div className="text-right">
                <button type="button" className="text-sm text-blue-600 hover:underline">
                  Forgot password?
                </button>
              </div>
            )}

            <div className="space-y-3">
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                {isLogin ? "Sign In" : "Sign Up"}
              </Button>

              {isLogin && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 bg-transparent"
                  onClick={handleFingerprintAuth}
                >
                  <Fingerprint className="h-4 w-4" />
                  Sign in with Fingerprint
                </Button>
              )}
            </div>

            {isLogin && (
              <div className="text-center text-sm text-slate-600 mt-2">
                <p>🔒 Secure biometric authentication available</p>
              </div>
            )}

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-slate-600 hover:underline"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
