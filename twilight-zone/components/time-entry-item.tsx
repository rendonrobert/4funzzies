"use client"

import { Button } from "@/components/ui/button"
import { formatDate, formatTime, calculateDuration } from "@/lib/time-utils"
import type { TimeEntry } from "@/lib/types"
import { Trash2 } from "lucide-react"

interface TimeEntryItemProps {
  entry: TimeEntry
  onDelete: (id: string) => void
}

export default function TimeEntryItem({ entry, onDelete }: TimeEntryItemProps) {
  const clockIn = new Date(entry.clockIn)
  const clockOut = new Date(entry.clockOut)
  const duration = calculateDuration(clockIn, clockOut)

  return (
    <div className="bg-white border rounded-lg p-3 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-sm font-medium">{formatDate(clockIn)}</div>
          <div className="text-xs text-gray-500 mt-1">
            {formatTime(clockIn)} - {formatTime(clockOut)}
          </div>
          <div className="text-sm font-medium mt-1">{duration.toFixed(2)} hours</div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-500 hover:text-red-500"
          onClick={() => onDelete(entry.id)}
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  )
}
