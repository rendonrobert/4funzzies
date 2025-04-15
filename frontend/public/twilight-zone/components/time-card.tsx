"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, ClipboardList, Printer } from "lucide-react"
import PunchHistory from "./punch-history"
import PrintReport from "./print-report"
import { formatTime, calculateDuration } from "@/lib/time-utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

export type Punch = {
  id: string
  type: "in" | "out"
  timestamp: number
  date: string
}

export default function TimeCard() {
  const [punches, setPunches] = useState<Punch[]>([])
  const [clockedIn, setClockedIn] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [totalHours, setTotalHours] = useState(0)

  // Load punches from localStorage on component mount
  useEffect(() => {
    const savedPunches = localStorage.getItem("timeCardPunches")
    if (savedPunches) {
      const parsedPunches = JSON.parse(savedPunches)
      setPunches(parsedPunches)

      // Check if the user is currently clocked in
      const lastPunch = parsedPunches[parsedPunches.length - 1]
      if (lastPunch && lastPunch.type === "in") {
        setClockedIn(true)
      }
    }
  }, [])

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Calculate total hours worked
  useEffect(() => {
    let total = 0
    for (let i = 0; i < punches.length; i += 2) {
      if (i + 1 < punches.length) {
        const inPunch = punches[i]
        const outPunch = punches[i + 1]
        if (inPunch.type === "in" && outPunch.type === "out") {
          const duration = (outPunch.timestamp - inPunch.timestamp) / (1000 * 60 * 60)
          total += duration
        }
      }
    }
    setTotalHours(total)
  }, [punches])

  // Save punches to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("timeCardPunches", JSON.stringify(punches))
  }, [punches])

  const handlePunch = (type: "in" | "out") => {
    const now = new Date()
    const newPunch: Punch = {
      id: crypto.randomUUID(),
      type,
      timestamp: now.getTime(),
      date: now.toISOString(),
    }

    setPunches([...punches, newPunch])
    setClockedIn(type === "in")
  }

  const clearAllPunches = () => {
    if (window.confirm("Are you sure you want to clear all punch records? This cannot be undone.")) {
      setPunches([])
      setClockedIn(false)
      setTotalHours(0)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-2xl flex items-center gap-2">
            <Clock className="h-6 w-6" />
            Current Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-center md:text-left">
                <p className="text-sm text-muted-foreground">Current Time</p>
                <p className="text-3xl font-bold">{formatTime(currentTime)}</p>
                <p className="text-sm text-muted-foreground">{currentTime.toLocaleDateString()}</p>
              </div>
              <div className="flex gap-4">
                <Button
                  size="lg"
                  onClick={() => handlePunch("in")}
                  disabled={clockedIn}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Clock In
                </Button>
                <Button
                  size="lg"
                  onClick={() => handlePunch("out")}
                  disabled={!clockedIn}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Clock Out
                </Button>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-100 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Status</p>
                <p className={`text-xl font-bold ${clockedIn ? "text-green-600" : "text-red-600"}`}>
                  {clockedIn ? "Clocked In" : "Clocked Out"}
                </p>
              </div>

              <div className="p-4 bg-gray-100 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Total Hours</p>
                <p className="text-xl font-bold">{totalHours.toFixed(2)}</p>
              </div>

              <div className="p-4 bg-gray-100 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Current Session</p>
                <p className="text-xl font-bold">
                  {clockedIn && punches.length > 0
                    ? calculateDuration(punches[punches.length - 1].timestamp, currentTime.getTime())
                    : "0:00"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="history">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="history">
            <ClipboardList className="h-4 w-4 mr-2" />
            Punch History
          </TabsTrigger>
          <TabsTrigger value="print">
            <Printer className="h-4 w-4 mr-2" />
            Print Report
          </TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
        </TabsList>
        <TabsContent value="history">
          <Card>
            <CardContent className="pt-6">
              <PunchHistory punches={punches} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="print">
          <PrintReport punches={punches} />
        </TabsContent>
        <TabsContent value="actions">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Data Management</h3>
                <p className="text-sm text-muted-foreground">
                  Warning: Clearing all punches will permanently delete your time card history.
                </p>
                <Button variant="destructive" onClick={clearAllPunches}>
                  Clear All Punches
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
