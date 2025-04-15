import TimeCard from "@/components/time-card"

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Twilight Zone</h1>
        <TimeCard />
      </div>
    </main>
  )
}
