"use client"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { addBill, updateBill } from "../lib/features/votingSlice"

export default function BillManagement({ onViewBill }) {
  const dispatch = useDispatch()
  const { bills } = useSelector((state) => state.voting)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(addBill(formData))
    setFormData({ title: "", description: "", category: "" })
    setIsDialogOpen(false)
  }

  const handleStatusChange = (billId, newStatus) => {
    const bill = bills.find((b) => b.id === billId)
    if (bill) {
      dispatch(updateBill({ ...bill, status: newStatus }))
    }
  }

  const sortedBills = [...bills].sort((a, b) => {
    // Active bills first
    if (a.status === "active" && b.status !== "active") return -1
    if (b.status === "active" && a.status !== "active") return 1
    // Then by creation date (newest first)
    return new Date(b.createdAt) - new Date(a.createdAt)
  })

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Bill Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Bill
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Bill</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Bill Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  Create Bill
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {sortedBills.map((bill) => (
          <Card key={bill.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{bill.title}</CardTitle>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline">{bill.category}</Badge>
                    <Badge
                      variant={
                        bill.status === "passed" ? "default" : bill.status === "failed" ? "destructive" : "secondary"
                      }
                      className={
                        bill.status === "passed"
                          ? "bg-green-100 text-green-800"
                          : bill.status === "failed"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                      }
                    >
                      {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                    </Badge>
                    {bill.status === "active" && (
                      <Badge className="bg-orange-100 text-orange-800 animate-pulse">🔴 LIVE</Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => onViewBill?.(bill.id)}>
                    View Details
                  </Button>
                  {bill.status === "active" && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(bill.id, "passed")}
                        className="text-green-600 hover:text-green-700"
                      >
                        Mark Passed
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(bill.id, "failed")}
                        className="text-red-600 hover:text-red-700"
                      >
                        Mark Failed
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-3">{bill.description}</p>
              <div className="text-sm text-slate-500">
                Created: {new Date(bill.createdAt).toLocaleDateString()}
                {bill.status === "active" && (
                  <span className="ml-4 text-green-600 font-medium">✅ Available for voting now</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {bills.length === 0 && (
        <Card className="mt-6">
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">No Bills Found</h3>
            <p className="text-slate-600 mb-4">Create your first bill to start the voting process.</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create First Bill
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
