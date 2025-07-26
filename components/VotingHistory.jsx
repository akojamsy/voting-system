"use client"

import { useSelector } from "react-redux"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function VotingHistory() {
  const { bills, votes } = useSelector((state) => state.voting)
  const { user } = useSelector((state) => state.auth)

  const userVotes = votes.filter((v) => v.userId === user?.id)
  const completedBills = bills.filter((b) => b.status !== "active")

  const getBillVoteCount = (billId, voteType) => {
    return votes.filter((v) => v.billId === billId && v.vote === voteType).length
  }

  const getUserVoteForBill = (billId) => {
    return userVotes.find((v) => v.billId === billId)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Voting History</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Your Voting History */}
        <Card>
          <CardHeader>
            <CardTitle>Your Voting History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {userVotes.length > 0 ? (
                userVotes.map((vote) => {
                  const bill = bills.find((b) => b.id === vote.billId)
                  return (
                    <div key={vote.id} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{bill?.title}</h4>
                        <p className="text-sm text-slate-600">{new Date(vote.timestamp).toLocaleDateString()}</p>
                      </div>
                      <Badge
                        variant={vote.vote === "yes" ? "default" : vote.vote === "no" ? "destructive" : "secondary"}
                        className={
                          vote.vote === "yes"
                            ? "bg-green-100 text-green-800"
                            : vote.vote === "no"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                        }
                      >
                        {vote.vote.toUpperCase()}
                      </Badge>
                    </div>
                  )
                })
              ) : (
                <p className="text-slate-600 text-center py-4">No votes cast yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* All Bills History */}
        <Card>
          <CardHeader>
            <CardTitle>All Bills History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {completedBills.map((bill) => {
                const userVote = getUserVoteForBill(bill.id)
                const yesCount = getBillVoteCount(bill.id, "yes")
                const noCount = getBillVoteCount(bill.id, "no")
                const abstainCount = getBillVoteCount(bill.id, "abstain")

                return (
                  <div key={bill.id} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{bill.title}</h4>
                      <Badge
                        variant={bill.status === "passed" ? "default" : "destructive"}
                        className={bill.status === "passed" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                      >
                        {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                      </Badge>
                    </div>

                    <div className="text-sm text-slate-600 mb-2">
                      <div className="flex gap-4">
                        <span>Yes: {yesCount}</span>
                        <span>No: {noCount}</span>
                        <span>Abstain: {abstainCount}</span>
                      </div>
                    </div>

                    {userVote && (
                      <div className="text-sm">
                        <span className="text-slate-600">Your vote: </span>
                        <Badge
                          variant="outline"
                          className={
                            userVote.vote === "yes"
                              ? "text-green-700"
                              : userVote.vote === "no"
                                ? "text-red-700"
                                : "text-gray-700"
                          }
                        >
                          {userVote.vote.toUpperCase()}
                        </Badge>
                      </div>
                    )}

                    <div className="text-xs text-slate-500 mt-2">{new Date(bill.createdAt).toLocaleDateString()}</div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
