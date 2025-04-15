"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Printer } from "lucide-react"
import type { Punch } from "./time-card"
import { calculateDailyHours, calculateWeeklyHours, formatDate } from "@/lib/time-utils"

export default function PrintReport({ punches }: { punches: Punch[] }) {
  const printRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    const content = printRef.current
    if (!content) return

    // Open print dialog
    window.print()
  }

  // Get daily and weekly totals
  const dailyTotals = calculateDailyHours(punches)
  const weeklyTotals = calculateWeeklyHours(punches)

  return (
    <div>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Printer className="h-6 w-6" />
              Print Time Card Report
            </CardTitle>
            <Button onClick={handlePrint} className="print:hidden">
              <Printer className="h-4 w-4 mr-2" />
              Print to PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div ref={printRef} className="print-container">
            <div className="print-header">
              <h1 className="text-2xl font-bold mb-2">Time Card Report</h1>
              <p className="text-sm text-muted-foreground mb-6">
                Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
              </p>
            </div>

            {/* Weekly Summary */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Weekly Summary</h2>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left">Week</th>
                    <th className="border p-2 text-left">Start Date</th>
                    <th className="border p-2 text-left">End Date</th>
                    <th className="border p-2 text-right">Total Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(weeklyTotals).map(([weekKey, data]) => (
                    <tr key={weekKey}>
                      <td className="border p-2">{weekKey}</td>
                      <td className="border p-2">{formatDate(data.startDate)}</td>
                      <td className="border p-2">{formatDate(data.endDate)}</td>
                      <td className="border p-2 text-right font-medium">{data.hours.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Daily Summary */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Daily Summary</h2>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left">Date</th>
                    <th className="border p-2 text-right">Hours Worked</th>
                    <th className="border p-2 text-left">Punch Details</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(dailyTotals)
                    .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
                    .map(([date, data]) => (
                      <tr key={date}>
                        <td className="border p-2">{formatDate(new Date(date))}</td>
                        <td className="border p-2 text-right font-medium">{data.hours.toFixed(2)}</td>
                        <td className="border p-2">
                          <div className="text-sm">
                            {data.punches.map((punch, index) => (
                              <div key={punch.id} className="mb-1 last:mb-0">
                                {punch.type === "in" ? "In: " : "Out: "}
                                {new Date(punch.date).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
