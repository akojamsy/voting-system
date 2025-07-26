"use client"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Edit, Trash2 } from "lucide-react"
import { addMember, updateMember, deleteMember } from "../lib/features/membersSlice"

export default function MemberManagement() {
  const dispatch = useDispatch()
  const { members } = useSelector((state) => state.members)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMember, setEditingMember] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    party: "",
    constituency: "",
    email: "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingMember) {
      dispatch(updateMember({ ...formData, id: editingMember.id }))
    } else {
      dispatch(addMember(formData))
    }
    resetForm()
  }

  const resetForm = () => {
    setFormData({ name: "", party: "", constituency: "", email: "" })
    setEditingMember(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (member) => {
    setEditingMember(member)
    setFormData({
      name: member.name,
      party: member.party,
      constituency: member.constituency,
      email: member.email,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this member?")) {
      dispatch(deleteMember(id))
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Parliament Members</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingMember(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingMember ? "Edit Member" : "Add New Member"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="party">Political Party</Label>
                <Input
                  id="party"
                  value={formData.party}
                  onChange={(e) => setFormData({ ...formData, party: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="constituency">Constituency</Label>
                <Input
                  id="constituency"
                  value={formData.constituency}
                  onChange={(e) => setFormData({ ...formData, constituency: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingMember ? "Update" : "Add"} Member
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((member) => (
          <Card key={member.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <Badge variant="outline" className="mt-1">
                    {member.party}
                  </Badge>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => handleEdit(member)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(member.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Constituency:</span> {member.constituency}
                </div>
                <div>
                  <span className="font-medium">Email:</span> {member.email}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {members.length === 0 && (
        <Card className="mt-6">
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">No Members Found</h3>
            <p className="text-slate-600 mb-4">Start by adding parliament members to the system.</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add First Member
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
