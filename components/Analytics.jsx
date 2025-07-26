"use client"

import { useSelector } from "react-redux"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { TrendingUp, Activity, Users } from "lucide-react"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"

export default function Analytics({ onViewBill }) {
  const { bills, votes } = useSelector((state) => state.voting)
  const { members } = useSelector((state) => state.members)

  // Calculate statistics
  const totalBills = bills.length
  const passedBills = bills.filter((b) => b.status === "passed").length
  const failedBills = bills.filter((b) => b.status === "failed").length
  const activeBills = bills.filter((b) => b.status === "active").length
  const totalVotes = votes.length

  // Calculate pass rate
  const completedBills = passedBills + failedBills
  const passRate = completedBills > 0 ? ((passedBills / completedBills) * 100).toFixed(1) : 0

  // Prepare chart data for Bill Status Distribution (Pie Chart)
  const billStatusData = [
    {
      name: "Passed",
      value: passedBills,
      fill: "var(--color-passed)",
    },
    {
      name: "Failed",
      value: failedBills,
      fill: "var(--color-failed)",
    },
    {
      name: "Active",
      value: activeBills,
      fill: "var(--color-active)",
    },
  ]

  // Prepare data for Voting Trends Histogram
  const votingTrendsData = bills.map((bill) => {
    const billVotes = votes.filter((v) => v.billId === bill.id)
    return {
      name: bill.title.length > 15 ? bill.title.substring(0, 15) + "..." : bill.title,
      fullName: bill.title,
      yes: billVotes.filter((v) => v.vote === "yes").length,
      no: billVotes.filter((v) => v.vote === "no").length,
      abstain: billVotes.filter((v) => v.vote === "abstain").length,
      total: billVotes.length,
      status: bill.status,
    }
  })

  // Category distribution for pie chart
  const categoryData = bills.reduce((acc, bill) => {
    const existing = acc.find((item) => item.name === bill.category)
    if (existing) {
      existing.value += 1
    } else {
      acc.push({
        name: bill.category,
        value: 1,
        fill: `hsl(${acc.length * 60}, 70%, 50%)`,
      })
    }
    return acc
  }, [])

  // Participation rate
  const participationRate =
    members.length > 0 && totalBills > 0 ? ((totalVotes / (members.length * totalBills)) * 100).toFixed(1) : 0

  const chartConfig = {
    passed: {
      label: "Passed",
      color: "hsl(var(--chart-1))",
    },
    failed: {
      label: "Failed",
      color: "hsl(var(--chart-2))",
    },
    active: {
      label: "Active",
      color: "hsl(var(--chart-3))",
    },
    yes: {
      label: "Yes",
      color: "hsl(var(--chart-1))",
    },
    no: {
      label: "No",
      color: "hsl(var(--chart-2))",
    },
    abstain: {
      label: "Abstain",
      color: "hsl(var(--chart-3))",
    },
  }

  return (
    <div className="p-6 space-y-6">
      {/* Enhanced Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bills</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBills}</div>
            <p className="text-xs text-muted-foreground">{activeBills} currently active</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{passRate}%</div>
            <p className="text-xs text-muted-foreground">
              {passedBills} of {completedBills} completed
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participation</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{participationRate}%</div>
            <p className="text-xs text-muted-foreground">Average voting participation</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{totalVotes}</div>
            <p className="text-xs text-muted-foreground">Across all bills</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bill Status Distribution - Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Bill Status Distribution</CardTitle>
            <p className="text-sm text-muted-foreground">Overview of all parliamentary bills</p>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
              <PieChart>
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={billStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={40}
                  paddingAngle={5}
                >
                  {billStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium">Passed</span>
                </div>
                <div className="text-2xl font-bold text-green-600">{passedBills}</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-sm font-medium">Failed</span>
                </div>
                <div className="text-2xl font-bold text-red-600">{failedBills}</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm font-medium">Active</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">{activeBills}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Distribution - Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Bills by Category</CardTitle>
            <p className="text-sm text-muted-foreground">Distribution across different sectors</p>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="mx-auto aspect-square max-h-[300px]">
              <PieChart>
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  paddingAngle={2}
                />
              </PieChart>
            </ChartContainer>
            <div className="mt-4 space-y-2">
              {categoryData.map((category, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.fill }}></div>
                    <span>{category.name}</span>
                  </div>
                  <span className="font-semibold">{category.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Voting Trends - Histogram */}
      <Card>
        <CardHeader>
          <CardTitle>Voting Analysis - Histogram</CardTitle>
          <p className="text-sm text-muted-foreground">Vote distribution across all bills</p>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[400px]">
            <BarChart
              data={votingTrendsData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <ChartTooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="bg-white p-3 border rounded-lg shadow-lg">
                        <p className="font-semibold">{data.fullName}</p>
                        <p className="text-sm text-muted-foreground mb-2">Status: {data.status}</p>
                        {payload.map((entry, index) => (
                          <p key={index} style={{ color: entry.color }}>
                            {entry.name}: {entry.value}
                          </p>
                        ))}
                        <p className="text-sm font-medium mt-1 border-t pt-1">Total: {data.total} votes</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar dataKey="yes" fill="var(--color-yes)" name="Yes" radius={[2, 2, 0, 0]} />
              <Bar dataKey="no" fill="var(--color-no)" name="No" radius={[2, 2, 0, 0]} />
              <Bar dataKey="abstain" fill="var(--color-abstain)" name="Abstain" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Vote Distribution Histogram */}
      <Card>
        <CardHeader>
          <CardTitle>Vote Count Distribution</CardTitle>
          <p className="text-sm text-muted-foreground">Frequency of vote counts across bills</p>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <BarChart
              data={votingTrendsData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="total" fill="hsl(var(--chart-4))" name="Total Votes" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Enhanced Recent Bills */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Recent Bills</CardTitle>
              <p className="text-sm text-muted-foreground">Latest parliamentary legislation</p>
            </div>
            <Badge variant="outline">{totalBills} Total</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...bills]
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 5)
              .map((bill) => {
                const billVotes = votes.filter((v) => v.billId === bill.id)
                const yesVotes = billVotes.filter((v) => v.vote === "yes").length
                const totalBillVotes = billVotes.length

                return (
                  <div
                    key={bill.id}
                    className="flex justify-between items-center p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{bill.title}</h4>
                        {bill.status === "active" && (
                          <Badge className="bg-orange-100 text-orange-800 animate-pulse text-xs">LIVE</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <span>{bill.category}</span>
                        <span>•</span>
                        <span>{totalBillVotes} votes</span>
                        <span>•</span>
                        <span>{new Date(bill.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {totalBillVotes > 0 && (
                        <div className="text-right text-xs">
                          <div className="text-green-600 font-medium">{yesVotes} Yes</div>
                          <div className="text-slate-500">{totalBillVotes - yesVotes} Other</div>
                        </div>
                      )}
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
                      <Button size="sm" variant="outline" onClick={() => onViewBill?.(bill.id)}>
                        View
                      </Button>
                    </div>
                  </div>
                )
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
