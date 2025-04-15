"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDateTime } from "@/lib/time-utils"
import type { Punch } from "./time-card"
import { LogIn, LogOut } from "lucide-react"

export default function PunchHistory({ punches }: { punches: Punch[] }) {
  // Group punches by date
  const punchesByDate = punches.reduce(
    (acc, punch) => {
      const date = new Date(punch.date).toLocaleDateString()
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(punch)
      return acc
    },
    {} as Record<string, Punch[]>,
  )

  // Sort dates in descending order (newest first)
  const sortedDates = Object.keys(punchesByDate).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime()
  })

  if (punches.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No punch records found. Clock in to start tracking your time.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {sortedDates.map((date) => (
        <div key={date} className="space-y-2">
          <h3 className="font-medium">{date}</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {punchesByDate[date]
                .sort((a, b) => b.timestamp - a.timestamp) // Sort by timestamp descending
                .map((punch) => (
                  <TableRow key={punch.id}>
                    <TableCell>{formatDateTime(new Date(punch.date))}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {punch.type === "in" ? (
                          <>
                            <LogIn className="h-4 w-4 text-green-600" />
                            <span className="text-green-600 font-medium">Clock In</span>
                          </>
                        ) : (
                          <>
                            <LogOut className="h-4 w-4 text-red-600" />
                            <span className="text-red-600 font-medium">Clock Out</span>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      ))}
    </div>
  )
}
