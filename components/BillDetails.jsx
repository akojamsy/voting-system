"use client"

import { useState } from "react"
import { useSelector } from "react-redux"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, User, FileText, Eye } from "lucide-react"
import BillOverview from "./BillOverview"

export default function BillDetails({ billId, onBack }) {
  const { bills, votes } = useSelector((state) => state.voting)
  const { members } = useSelector((state) => state.members)
  const [showOverview, setShowOverview] = useState(false)

  const bill = bills.find((b) => b.id === Number.parseInt(billId))

  if (!bill) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Bill Not Found</h2>
            <p className="text-slate-600">The requested bill could not be found.</p>
            <Button onClick={onBack} className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (showOverview) {
    return <BillOverview billId={billId} onBack={() => setShowOverview(false)} />
  }

  const billVotes = votes.filter((v) => v.billId === bill.id)
  const yesVotes = billVotes.filter((v) => v.vote === "yes").length
  const noVotes = billVotes.filter((v) => v.vote === "no").length
  const abstainVotes = billVotes.filter((v) => v.vote === "abstain").length
  const totalVotes = billVotes.length

  const getVotePercentage = (count) => {
    return totalVotes > 0 ? ((count / totalVotes) * 100).toFixed(1) : 0
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <Button onClick={onBack} variant="outline" className="mb-4 bg-transparent">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Bill Details */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl mb-2">{bill.title}</CardTitle>
                  <div className="flex gap-2">
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
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <FileText className="mr-2 h-5 w-5" />
                    Description
                  </h3>
                  <p className="text-slate-700 leading-relaxed">{bill.description}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    Bill Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Created:</span> {new Date(bill.createdAt).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Status:</span>{" "}
                      {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                    </div>
                    <div>
                      <span className="font-medium">Category:</span> {bill.category}
                    </div>
                    <div>
                      <span className="font-medium">Total Votes:</span> {totalVotes}
                    </div>
                  </div>
                </div>

                {/* View Details Button */}
                <div className="pt-4 border-t">
                  <Button onClick={() => setShowOverview(true)} className="w-full bg-blue-600 hover:bg-blue-700">
                    <Eye className="mr-2 h-4 w-4" />
                    View Full Bill Overview
                  </Button>
                </div>

                {/* Detailed Bill Content */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Full Bill Text</h3>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-slate-700 leading-relaxed">
                      {bill.description}
                      <br />
                      <br />
                      <strong>Whereas,</strong> the Parliament recognizes the importance of this legislation for the
                      welfare of the citizens;
                      <br />
                      <br />
                      <strong>Be it enacted</strong> by the Parliament that the provisions outlined in this bill shall
                      be implemented according to the specified guidelines and regulations.
                      <br />
                      <br />
                      <strong>Section 1:</strong> This act shall take effect immediately upon passage.
                      <br />
                      <strong>Section 2:</strong> All relevant departments shall coordinate to ensure proper
                      implementation.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Voting Statistics */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Voting Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Yes Votes</span>
                    <span className="text-sm font-bold text-green-600">
                      {yesVotes} ({getVotePercentage(yesVotes)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${getVotePercentage(yesVotes)}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">No Votes</span>
                    <span className="text-sm font-bold text-red-600">
                      {noVotes} ({getVotePercentage(noVotes)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: `${getVotePercentage(noVotes)}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Abstain</span>
                    <span className="text-sm font-bold text-gray-600">
                      {abstainVotes} ({getVotePercentage(abstainVotes)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-gray-500 h-2 rounded-full"
                      style={{ width: `${getVotePercentage(abstainVotes)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{totalVotes}</div>
                    <div className="text-sm text-slate-600">Total Votes Cast</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Voting Members */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Voting Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {billVotes.map((vote) => {
                  const member = members.find((m) => m.id === vote.userId)
                  return (
                    <div key={vote.id} className="flex justify-between items-center text-sm">
                      <span>{member?.name || `User ${vote.userId}`}</span>
                      <Badge
                        variant="outline"
                        className={
                          vote.vote === "yes" ? "text-green-700" : vote.vote === "no" ? "text-red-700" : "text-gray-700"
                        }
                      >
                        {vote.vote.toUpperCase()}
                      </Badge>
                    </div>
                  )
                })}
                {billVotes.length === 0 && <p className="text-slate-600 text-center py-4">No votes cast yet</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
