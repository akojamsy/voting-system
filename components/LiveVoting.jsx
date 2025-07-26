"use client"

import { useSelector, useDispatch } from "react-redux"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { castVote, updateBill } from "../lib/features/votingSlice"
import { StopCircle, AlertTriangle } from "lucide-react"
import { useState } from "react"

export default function LiveVoting() {
  const dispatch = useDispatch()
  const { bills, votes } = useSelector((state) => state.voting)
  const { user } = useSelector((state) => state.auth)
  const [isClosingVote, setIsClosingVote] = useState(false)

  const activeBills = bills
    .filter((bill) => bill.status === "active")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  const currentBill = activeBills[0] // Most recent active bill
  const userVote = votes.find((v) => v.billId === currentBill?.id && v.userId === user?.id)

  const handleVote = (vote, billId = currentBill?.id) => {
    if (billId && user) {
      dispatch(
        castVote({
          billId: billId,
          userId: user.id,
          vote,
        }),
      )
    }
  }

  const getVoteCount = (voteType, billId = currentBill?.id) => {
    return votes.filter((v) => v.billId === billId && v.vote === voteType).length
  }

  const handleCloseVoting = (bill) => {
    const yesVotes = getVoteCount("yes", bill.id)
    const noVotes = getVoteCount("no", bill.id)
    const abstainVotes = getVoteCount("abstain", bill.id)

    let newStatus = "failed" // Default to failed

    // Determine outcome based on highest vote count
    if (yesVotes > noVotes && yesVotes > abstainVotes) {
      newStatus = "passed"
    } else if (noVotes > yesVotes && noVotes > abstainVotes) {
      newStatus = "failed"
    } else if (abstainVotes > yesVotes && abstainVotes > noVotes) {
      newStatus = "failed" // Abstain majority = failed
    } else {
      // In case of tie, check if yes has at least equal votes
      newStatus = yesVotes >= noVotes ? "passed" : "failed"
    }

    dispatch(updateBill({ ...bill, status: newStatus }))
    setIsClosingVote(false)
  }

  const recentBills = bills
    .filter((bill) => bill.status !== "active")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3)

  if (!currentBill) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">No Active Voting Session</h2>
            <p className="text-slate-600">There are currently no bills available for voting.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Voting Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl">Live Voting Session</CardTitle>
                  <p className="text-sm text-slate-600">Voting on Bill</p>
                </div>
                {user?.role === "admin" && (
                  <Dialog open={isClosingVote} onOpenChange={setIsClosingVote}>
                    <DialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <StopCircle className="mr-2 h-4 w-4" />
                        Close Voting
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="flex items-center">
                          <AlertTriangle className="mr-2 h-5 w-5 text-yellow-600" />
                          Close Voting Session
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p className="text-slate-600">
                          Are you sure you want to close the voting session for "{currentBill.title}"?
                        </p>
                        <div className="bg-slate-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">Current Vote Count:</h4>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span>Yes:</span>
                              <span className="font-semibold text-green-600">{getVoteCount("yes")}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>No:</span>
                              <span className="font-semibold text-red-600">{getVoteCount("no")}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Abstain:</span>
                              <span className="font-semibold text-gray-600">{getVoteCount("abstain")}</span>
                            </div>
                          </div>
                          <div className="mt-3 pt-3 border-t">
                            <div className="flex justify-between font-semibold">
                              <span>Predicted Outcome:</span>
                              <span
                                className={
                                  getVoteCount("yes") > getVoteCount("no") &&
                                  getVoteCount("yes") > getVoteCount("abstain")
                                    ? "text-green-600"
                                    : "text-red-600"
                                }
                              >
                                {getVoteCount("yes") > getVoteCount("no") &&
                                getVoteCount("yes") > getVoteCount("abstain")
                                  ? "PASSED"
                                  : "FAILED"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-slate-500">
                          This action cannot be undone. The bill status will be automatically determined based on the
                          vote count.
                        </p>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleCloseVoting(currentBill)}
                            variant="destructive"
                            className="flex-1"
                          >
                            Close Voting & Finalize Result
                          </Button>
                          <Button variant="outline" onClick={() => setIsClosingVote(false)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">{currentBill.title}</h3>
                <p className="text-slate-600 mb-4">{currentBill.description}</p>

                {userVote && (
                  <div className="mb-4">
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      You voted: {userVote.vote.toUpperCase()}
                    </Badge>
                  </div>
                )}
              </div>

              <div className="flex gap-4 mb-6">
                <Button
                  onClick={() => handleVote("yes")}
                  className="bg-blue-600 hover:bg-blue-700 flex-1"
                  disabled={!!userVote}
                >
                  Yes ({getVoteCount("yes")})
                </Button>
                <Button onClick={() => handleVote("no")} variant="destructive" className="flex-1" disabled={!!userVote}>
                  No ({getVoteCount("no")})
                </Button>
                <Button
                  onClick={() => handleVote("abstain")}
                  variant="outline"
                  className="flex-1"
                  disabled={!!userVote}
                >
                  Abstain ({getVoteCount("abstain")})
                </Button>
              </div>

              {userVote && (
                <p className="text-sm text-slate-600">You have already voted on this bill. Votes cannot be changed.</p>
              )}
            </CardContent>
          </Card>

          {/* All Active Bills Section */}
          {activeBills.length > 1 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Other Active Bills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activeBills.slice(1).map((bill) => {
                    const userVoteForBill = votes.find((v) => v.billId === bill.id && v.userId === user?.id)
                    return (
                      <div key={bill.id} className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{bill.title}</h4>
                          <p className="text-sm text-slate-600">{bill.category}</p>
                        </div>
                        <div className="flex gap-2">
                          {!userVoteForBill ? (
                            <>
                              <Button size="sm" onClick={() => handleVote("yes", bill.id)} className="bg-blue-600">
                                Yes
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => handleVote("no", bill.id)}>
                                No
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleVote("abstain", bill.id)}>
                                Abstain
                              </Button>
                            </>
                          ) : (
                            <Badge variant="outline" className="bg-green-50 text-green-700">
                              Voted: {userVoteForBill.vote.toUpperCase()}
                            </Badge>
                          )}
                          {user?.role === "admin" && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleCloseVoting(bill)}
                              className="ml-2"
                            >
                              <StopCircle className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Votes */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Votes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentBills.map((bill) => (
                  <div key={bill.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <span className="font-medium">{bill.title}</span>
                    <Badge
                      variant={bill.status === "passed" ? "default" : "destructive"}
                      className={bill.status === "passed" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                    >
                      {bill.status === "passed" ? "Passed" : "Failed"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bill Details */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Bill Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-lg">{currentBill.title}</h4>
                  <Badge className="mt-1">{currentBill.category}</Badge>
                </div>

                <div>
                  <p className="text-slate-600">{currentBill.description}</p>
                </div>

                <div className="pt-4">
                  <Button variant="outline" className="w-full bg-transparent">
                    View details
                  </Button>
                </div>

                <div className="pt-4 border-t">
                  <h5 className="font-medium mb-2">Current Results</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Yes:</span>
                      <span className="font-medium">{getVoteCount("yes")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>No:</span>
                      <span className="font-medium">{getVoteCount("no")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Abstain:</span>
                      <span className="font-medium">{getVoteCount("abstain")}</span>
                    </div>
                  </div>
                </div>

                {/* Live Status Indicator */}
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-red-600 font-medium">LIVE VOTING SESSION</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
