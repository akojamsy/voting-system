"use client"

import { useSelector } from "react-redux"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, FileText, Vote, Clock, CheckCircle, XCircle } from "lucide-react"

export default function BillOverview({ billId, onBack }) {
  const { bills, votes } = useSelector((state) => state.voting)
  const { members } = useSelector((state) => state.members)

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

  const billVotes = votes.filter((v) => v.billId === bill.id)
  const yesVotes = billVotes.filter((v) => v.vote === "yes").length
  const noVotes = billVotes.filter((v) => v.vote === "no").length
  const abstainVotes = billVotes.filter((v) => v.vote === "abstain").length
  const totalVotes = billVotes.length
  const totalMembers = members.length

  const getVotePercentage = (count) => {
    return totalVotes > 0 ? ((count / totalVotes) * 100).toFixed(1) : 0
  }

  const getParticipationRate = () => {
    return totalMembers > 0 ? ((totalVotes / totalMembers) * 100).toFixed(1) : 0
  }

  const getBillOutcome = () => {
    if (bill.status === "active") return "Voting in Progress"
    if (yesVotes > noVotes && yesVotes > abstainVotes) return "PASSED"
    if (noVotes > yesVotes && noVotes > abstainVotes) return "FAILED"
    return "TIE/INCONCLUSIVE"
  }

  const getOutcomeColor = () => {
    const outcome = getBillOutcome()
    if (outcome === "PASSED") return "text-green-600"
    if (outcome === "FAILED") return "text-red-600"
    return "text-yellow-600"
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <Button onClick={onBack} variant="outline" className="mb-4 bg-transparent">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Bill Details
        </Button>
      </div>

      {/* Bill Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-3xl mb-3">{bill.title}</CardTitle>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="text-sm px-3 py-1">
                  {bill.category}
                </Badge>
                <Badge
                  variant={
                    bill.status === "passed" ? "default" : bill.status === "failed" ? "destructive" : "secondary"
                  }
                  className={`text-sm px-3 py-1 ${
                    bill.status === "passed"
                      ? "bg-green-100 text-green-800"
                      : bill.status === "failed"
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                </Badge>
                {bill.status === "active" && (
                  <Badge className="bg-orange-100 text-orange-800 animate-pulse text-sm px-3 py-1">🔴 LIVE</Badge>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold ${getOutcomeColor()}`}>{getBillOutcome()}</div>
              <div className="text-sm text-slate-600">Current Status</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bill Overview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Executive Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Executive Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 leading-relaxed text-lg">{bill.description}</p>
            </CardContent>
          </Card>

          {/* Key Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Bill Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-600">Bill ID:</span>
                    <span className="font-mono">#{bill.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-600">Category:</span>
                    <span>{bill.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-600">Status:</span>
                    <span className="capitalize">{bill.status}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-600">Created:</span>
                    <span>{new Date(bill.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-600">Total Votes:</span>
                    <span className="font-semibold">{totalVotes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-600">Participation:</span>
                    <span className="font-semibold">{getParticipationRate()}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bill Objectives */}
          <Card>
            <CardHeader>
              <CardTitle>Bill Objectives</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Primary Objective</h4>
                    <p className="text-slate-600">
                      To address the core issues outlined in the {bill.category.toLowerCase()} sector through
                      comprehensive legislative reform.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Implementation Strategy</h4>
                    <p className="text-slate-600">
                      Establish clear guidelines and frameworks for effective implementation across all relevant
                      departments and agencies.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Expected Outcomes</h4>
                    <p className="text-slate-600">
                      Measurable improvements in {bill.category.toLowerCase()} services and overall citizen
                      satisfaction.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Impact Assessment */}
          <Card>
            <CardHeader>
              <CardTitle>Impact Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">High</div>
                  <div className="text-sm text-green-700">Positive Impact</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">Medium</div>
                  <div className="text-sm text-blue-700">Implementation Cost</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">6-12</div>
                  <div className="text-sm text-yellow-700">Months Timeline</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Voting Statistics Sidebar */}
        <div className="space-y-6">
          {/* Vote Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Vote className="mr-2 h-5 w-5" />
                Vote Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium flex items-center">
                      <CheckCircle className="mr-1 h-4 w-4 text-green-600" />
                      Yes Votes
                    </span>
                    <span className="text-sm font-bold text-green-600">
                      {yesVotes} ({getVotePercentage(yesVotes)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className="bg-green-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${getVotePercentage(yesVotes)}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium flex items-center">
                      <XCircle className="mr-1 h-4 w-4 text-red-600" />
                      No Votes
                    </span>
                    <span className="text-sm font-bold text-red-600">
                      {noVotes} ({getVotePercentage(noVotes)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className="bg-red-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${getVotePercentage(noVotes)}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium flex items-center">
                      <Clock className="mr-1 h-4 w-4 text-gray-600" />
                      Abstain
                    </span>
                    <span className="text-sm font-bold text-gray-600">
                      {abstainVotes} ({getVotePercentage(abstainVotes)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className="bg-gray-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${getVotePercentage(abstainVotes)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-slate-700">{totalVotes}</div>
                    <div className="text-sm text-slate-600">Total Votes Cast</div>
                    <div className="text-xs text-slate-500 mt-1">{getParticipationRate()}% Participation Rate</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Voting Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Voting Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div>
                    <div className="text-sm font-medium">Bill Created</div>
                    <div className="text-xs text-slate-600">{new Date(bill.createdAt).toLocaleString()}</div>
                  </div>
                </div>
                {bill.status === "active" ? (
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                    <div>
                      <div className="text-sm font-medium">Voting Active</div>
                      <div className="text-xs text-slate-600">Currently accepting votes</div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${bill.status === "passed" ? "bg-green-500" : "bg-red-500"}`}
                    ></div>
                    <div>
                      <div className="text-sm font-medium">Voting Closed</div>
                      <div className="text-xs text-slate-600">
                        Result: {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Eligible Voters:</span>
                  <span className="font-semibold">{totalMembers}</span>
                </div>
                <div className="flex justify-between">
                  <span>Votes Cast:</span>
                  <span className="font-semibold">{totalVotes}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pending Votes:</span>
                  <span className="font-semibold">{totalMembers - totalVotes}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span>Leading Vote:</span>
                  <span className={`font-semibold ${getOutcomeColor()}`}>
                    {yesVotes > noVotes && yesVotes > abstainVotes
                      ? "YES"
                      : noVotes > yesVotes && noVotes > abstainVotes
                        ? "NO"
                        : "TIE"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
