"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDate, formatTime, calculateDuration } from "@/lib/time-utils"
import type { TimeEntry } from "@/lib/types"
import { useMobile } from "@/hooks/use-mobile"
import { Clock, ClipboardList } from "lucide-react"
import TimeEntryItem from "./time-entry-item"
import ClockInOutButton from "./clock-in-out-button"

export default function TimeCardApp() {
  const [entries, setEntries] = useState<TimeEntry[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("timeEntries")
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  const [clockedIn, setClockedIn] = useState<Date | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeTab, setActiveTab] = useState<"clock" | "history">("clock")
  const { isMobile } = useMobile()

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Save entries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("timeEntries", JSON.stringify(entries))
  }, [entries])

  const handleClockIn = () => {
    const now = new Date()
    setClockedIn(now)
  }

  const handleClockOut = () => {
    if (!clockedIn) return

    const now = new Date()
    const newEntry: TimeEntry = {
      id: Date.now().toString(),
      clockIn: clockedIn.toISOString(),
      clockOut: now.toISOString(),
    }

    setEntries([newEntry, ...entries])
    setClockedIn(null)
  }

  const deleteEntry = (id: string) => {
    setEntries(entries.filter((entry) => entry.id !== id))
  }

  const totalHoursToday = entries
    .filter((entry) => {
      const entryDate = new Date(entry.clockIn)
      const today = new Date()
      return (
        entryDate.getDate() === today.getDate() &&
        entryDate.getMonth() === today.getMonth() &&
        entryDate.getFullYear() === today.getFullYear()
      )
    })
    .reduce((total, entry) => {
      const duration = calculateDuration(new Date(entry.clockIn), new Date(entry.clockOut))
      return total + duration
    }, 0)

  const totalHoursThisWeek = entries
    .filter((entry) => {
      const entryDate = new Date(entry.clockIn)
      const today = new Date()
      const dayOfWeek = today.getDay()
      const startOfWeek = new Date(today)
      startOfWeek.setDate(today.getDate() - dayOfWeek)
      startOfWeek.setHours(0, 0, 0, 0)

      return entryDate >= startOfWeek
    })
    .reduce((total, entry) => {
      const duration = calculateDuration(new Date(entry.clockIn), new Date(entry.clockOut))
      return total + duration
    }, 0)

  return (
    <div className="w-full max-w-md px-4 py-6">
      <Card className="shadow-lg border-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-center text-xl">Twilight Zone</CardTitle>
        </CardHeader>

        <div className="flex border-b">
          <button
            className={`flex-1 py-3 flex justify-center items-center gap-2 ${activeTab === "clock" ? "border-b-2 border-primary font-medium" : "text-gray-500"}`}
            onClick={() => setActiveTab("clock")}
          >
            <Clock size={18} />
            <span>Clock</span>
          </button>
          <button
            className={`flex-1 py-3 flex justify-center items-center gap-2 ${activeTab === "history" ? "border-b-2 border-primary font-medium" : "text-gray-500"}`}
            onClick={() => setActiveTab("history")}
          >
            <ClipboardList size={18} />
            <span>History</span>
          </button>
        </div>

        <CardContent className="pt-4">
          {activeTab === "clock" ? (
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-sm text-gray-500">{formatDate(currentTime)}</div>
                <div className="text-3xl font-bold mt-1">{formatTime(currentTime)}</div>
              </div>

              <ClockInOutButton clockedIn={clockedIn} onClockIn={handleClockIn} onClockOut={handleClockOut} />

              {clockedIn && (
                <div className="text-center text-sm">
                  <div className="font-medium">Clocked in at</div>
                  <div>{formatTime(clockedIn)}</div>
                  <div className="mt-2 text-xs text-gray-500">
                    Duration: {calculateDuration(clockedIn, currentTime).toFixed(2)} hours
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="text-xs text-gray-500">Today</div>
                  <div className="font-medium">{totalHoursToday.toFixed(2)} hrs</div>
                </div>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="text-xs text-gray-500">This Week</div>
                  <div className="font-medium">{totalHoursThisWeek.toFixed(2)} hrs</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="font-medium">Recent Entries</h3>
              {entries.length > 0 ? (
                <ScrollArea className="h-[300px]">
                  <div className="space-y-3">
                    {entries.map((entry) => (
                      <TimeEntryItem key={entry.id} entry={entry} onDelete={deleteEntry} />
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center py-8 text-gray-500">No time entries yet</div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
