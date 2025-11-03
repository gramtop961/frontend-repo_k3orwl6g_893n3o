import { useEffect, useMemo, useState } from 'react'
import { Smile, Meh, Frown, Heart } from 'lucide-react'

const moods = [
  { key: 'great', label: 'Great', color: 'text-emerald-600', bg: 'bg-emerald-50', Icon: Smile },
  { key: 'ok', label: 'Okay', color: 'text-amber-600', bg: 'bg-amber-50', Icon: Meh },
  { key: 'low', label: 'Low', color: 'text-rose-600', bg: 'bg-rose-50', Icon: Frown },
]

export default function MoodTracker() {
  const [selected, setSelected] = useState(null)
  const [history, setHistory] = useState([])

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('ff_mood_history') || '[]')
    setHistory(saved)
    setSelected(saved[saved.length - 1]?.key || null)
  }, [])

  const average = useMemo(() => {
    if (history.length === 0) return null
    const scoreMap = { great: 3, ok: 2, low: 1 }
    const avg = history.reduce((a, b) => a + (scoreMap[b.key] || 0), 0) / history.length
    if (avg >= 2.5) return 'Great'
    if (avg >= 1.6) return 'Okay'
    return 'Low'
  }, [history])

  const selectMood = (m) => {
    const item = { key: m.key, at: new Date().toISOString() }
    const next = [...history, item]
    setHistory(next)
    setSelected(m.key)
    localStorage.setItem('ff_mood_history', JSON.stringify(next))
  }

  return (
    <div className="w-full h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-rose-600" />
          <h2 className="text-lg font-semibold text-gray-800">Mood Tracker</h2>
        </div>
        {average && (
          <span className="text-xs text-gray-500">Avg: {average}</span>
        )}
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <p className="text-sm text-gray-600">How are you feeling after this session?</p>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {moods.map((m) => (
            <button
              key={m.key}
              onClick={() => selectMood(m)}
              className={`flex flex-col items-center justify-center rounded-xl p-4 border transition ${selected === m.key ? 'border-current ' + m.bg + ' ' + m.color : 'border-gray-200 hover:border-gray-300'} `}
            >
              <m.Icon className={`w-6 h-6 ${m.color}`} />
              <span className="mt-2 text-sm text-gray-700">{m.label}</span>
            </button>
          ))}
        </div>
        {history.length > 0 && (
          <div className="mt-4 text-xs text-gray-500">
            Last update: {new Date(history[history.length - 1].at).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  )
}
