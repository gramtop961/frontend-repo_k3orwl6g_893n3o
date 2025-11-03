import { useEffect, useMemo, useState } from 'react'
import Timer from './components/Timer'
import MoodTracker from './components/MoodTracker'
import Journal from './components/Journal'
import MusicPlayer from './components/MusicPlayer'
import { Brain, BarChart3 } from 'lucide-react'

export default function App() {
  const [sessions, setSessions] = useState(() => Number(localStorage.getItem('ff_sessions') || 0))

  useEffect(() => {
    localStorage.setItem('ff_sessions', String(sessions))
  }, [sessions])

  const onSessionComplete = () => setSessions((s) => s + 1)

  const avgMood = useMemo(() => {
    const saved = JSON.parse(localStorage.getItem('ff_mood_history') || '[]')
    if (saved.length === 0) return '—'
    const scoreMap = { great: 3, ok: 2, low: 1 }
    const avg = saved.reduce((a, b) => a + (scoreMap[b.key] || 0), 0) / saved.length
    if (avg >= 2.5) return 'Great'
    if (avg >= 1.6) return 'Okay'
    return 'Low'
  }, [sessions])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-sky-50 to-rose-50">
      <header className="px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white grid place-items-center shadow-sm">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">FocusFlow</h1>
            <p className="text-sm text-gray-500">Pomodoro x Mindfulness</p>
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2 text-gray-700">
            <BarChart3 className="w-4 h-4 text-indigo-600" />
            <span className="font-medium">Sessions:</span> {sessions}
          </div>
          <div className="hidden sm:flex items-center gap-2 text-gray-700">
            <span className="font-medium">Avg mood:</span> {avgMood}
          </div>
        </div>
      </header>

      <main className="px-6 pb-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1">
            <Timer onSessionComplete={onSessionComplete} />
          </div>
          <div className="col-span-1">
            <MoodTracker />
          </div>
          <div className="col-span-1">
            <Journal />
          </div>
          <div className="col-span-1">
            <MusicPlayer />
          </div>
        </div>

        <section className="mt-10">
          <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700">How it works</h3>
            <ul className="mt-3 text-sm text-gray-600 list-disc pl-5 space-y-1">
              <li>Set your focus and break durations, then start the timer.</li>
              <li>After each session, log your mood and write a short reflection.</li>
              <li>Play calming music to stay in flow or relax during breaks.</li>
              <li>We keep simple stats locally; cloud sync and AI coach can be added later.</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  )
}
