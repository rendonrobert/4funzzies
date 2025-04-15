import type { Punch } from "@/components/time-card"

export function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
}

export function formatDateTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString([], { year: "numeric", month: "short", day: "numeric" })
}

export function calculateDuration(startTime: number, endTime: number): string {
  const durationMs = endTime - startTime
  const hours = Math.floor(durationMs / (1000 * 60 * 60))
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))

  return `${hours}:${minutes.toString().padStart(2, "0")}`
}

// Get the week number and year (e.g., "2023-W42")
export function getWeekKey(date: Date): string {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7))
  const week = Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 4).getTime()) / 86400000 / 7) + 1
  return `${d.getFullYear()}-W${week.toString().padStart(2, "0")}`
}

// Get start and end date of a week
export function getWeekRange(date: Date): { start: Date; end: Date } {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Adjust when day is Sunday
  const monday = new Date(d.setDate(diff))
  monday.setHours(0, 0, 0, 0)

  const sunday = new Date(monday)
  sunday.setDate(sunday.getDate() + 6)
  sunday.setHours(23, 59, 59, 999)

  return { start: monday, end: sunday }
}

// Calculate hours worked per day
export function calculateDailyHours(punches: Punch[]): Record<string, { hours: number; punches: Punch[] }> {
  const dailyHours: Record<string, { hours: number; punches: Punch[] }> = {}

  // Group punches by date
  punches.forEach((punch) => {
    const date = new Date(punch.date).toLocaleDateString()
    if (!dailyHours[date]) {
      dailyHours[date] = { hours: 0, punches: [] }
    }
    dailyHours[date].punches.push(punch)
  })

  // Calculate hours for each day
  Object.keys(dailyHours).forEach((date) => {
    const dayPunches = dailyHours[date].punches.sort((a, b) => a.timestamp - b.timestamp)
    let totalHours = 0

    for (let i = 0; i < dayPunches.length; i += 2) {
      if (i + 1 < dayPunches.length) {
        const inPunch = dayPunches[i]
        const outPunch = dayPunches[i + 1]
        if (inPunch.type === "in" && outPunch.type === "out") {
          const duration = (outPunch.timestamp - inPunch.timestamp) / (1000 * 60 * 60)
          totalHours += duration
        }
      }
    }

    dailyHours[date].hours = totalHours
  })

  return dailyHours
}

// Calculate hours worked per week
export function calculateWeeklyHours(
  punches: Punch[],
): Record<string, { hours: number; startDate: Date; endDate: Date }> {
  const weeklyHours: Record<string, { hours: number; startDate: Date; endDate: Date }> = {}
  const dailyHours = calculateDailyHours(punches)

  // Group by week
  Object.entries(dailyHours).forEach(([dateStr, data]) => {
    const date = new Date(dateStr)
    const weekKey = getWeekKey(date)
    const weekRange = getWeekRange(date)

    if (!weeklyHours[weekKey]) {
      weeklyHours[weekKey] = {
        hours: 0,
        startDate: weekRange.start,
        endDate: weekRange.end,
      }
    }

    weeklyHours[weekKey].hours += data.hours
  })

  return weeklyHours
}
