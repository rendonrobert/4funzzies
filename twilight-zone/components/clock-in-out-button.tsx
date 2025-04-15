"use client"

import { Button } from "@/components/ui/button"
import { LogIn, LogOut } from "lucide-react"

interface ClockInOutButtonProps {
  clockedIn: Date | null
  onClockIn: () => void
  onClockOut: () => void
}

export default function ClockInOutButton({ clockedIn, onClockIn, onClockOut }: ClockInOutButtonProps) {
  if (clockedIn) {
    return (
      <Button variant="destructive" size="lg" className="w-full h-16 text-lg font-medium" onClick={onClockOut}>
        <LogOut className="mr-2 h-5 w-5" />
        Clock Out
      </Button>
    )
  }

  return (
    <Button variant="default" size="lg" className="w-full h-16 text-lg font-medium" onClick={onClockIn}>
      <LogIn className="mr-2 h-5 w-5" />
      Clock In
    </Button>
  )
}
