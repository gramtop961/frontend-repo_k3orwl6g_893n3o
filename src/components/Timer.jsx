import { useEffect, useMemo, useRef, useState } from 'react'
import { Play, Pause, RotateCcw, Timer as TimerIcon } from 'lucide-react'

const formatTime = (sec) => {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function Timer({ onSessionComplete }) {
  const [isRunning, setIsRunning] = useState(false)
  const [isBreak, setIsBreak] = useState(false)
  const [workMinutes, setWorkMinutes] = useState(25)
  const [breakMinutes, setBreakMinutes] = useState(5)
  const [secondsLeft, setSecondsLeft] = useState(workMinutes * 60)
  const intervalRef = useRef(null)

  // Update remaining seconds when lengths change and timer not running
  useEffect(() => {
    if (!isRunning) setSecondsLeft((isBreak ? breakMinutes : workMinutes) * 60)
  }, [workMinutes, breakMinutes])

  // Ticking
  useEffect(() => {
    if (!isRunning) return
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current)
          const nextIsBreak = !isBreak
          setIsBreak(nextIsBreak)
          const nextSeconds = (nextIsBreak ? breakMinutes : workMinutes) * 60
          // Auto start next session
          setIsRunning(true)
          // Fire completion for work sessions only
          if (!nextIsBreak && typeof onSessionComplete === 'function') {
            onSessionComplete()
          }
          return nextSeconds
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [isRunning, isBreak, workMinutes, breakMinutes, onSessionComplete])

  const progress = useMemo(() => {
    const total = (isBreak ? breakMinutes : workMinutes) * 60
    return 100 - Math.floor((secondsLeft / total) * 100)
  }, [secondsLeft, isBreak, workMinutes, breakMinutes])

  const handleReset = () => {
    setIsRunning(false)
    setSecondsLeft((isBreak ? breakMinutes : workMinutes) * 60)
  }

  const handleStartPause = () => setIsRunning((v) => !v)

  return (
    <div className="w-full h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TimerIcon className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-gray-800">Pomodoro Timer</h2>
        </div>
        <span className={`px-2 py-1 text-xs rounded-full ${isBreak ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'}`}>
          {isBreak ? 'Break' : 'Focus'}
        </span>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="text-center">
          <div className="relative mx-auto w-48 h-48">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" className="stroke-gray-200" strokeWidth="10" fill="none" />
              <circle
                cx="50"
                cy="50"
                r="45"
                className="stroke-indigo-500 transition-all duration-300 ease-linear"
                strokeWidth="10"
                strokeDasharray={`${Math.min(progress, 100)} 100`}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-4xl font-bold tabular-nums text-gray-800">{formatTime(secondsLeft)}</div>
              <div className="text-xs text-gray-500 mt-1">{isBreak ? 'Take a breath' : 'Deep focus'}</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              onClick={handleStartPause}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white ${isRunning ? 'bg-rose-500 hover:bg-rose-600' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isRunning ? 'Pause' : 'Start'}
            </button>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="bg-gray-50 rounded-lg p-3">
              <label className="text-xs text-gray-500">Focus (min)</label>
              <input
                type="number"
                min={1}
                max={120}
                value={workMinutes}
                onChange={(e) => setWorkMinutes(Math.max(1, Number(e.target.value)))}
                className="mt-1 w-full rounded-md border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <label className="text-xs text-gray-500">Break (min)</label>
              <input
                type="number"
                min={1}
                max={60}
                value={breakMinutes}
                onChange={(e) => setBreakMinutes(Math.max(1, Number(e.target.value)))}
                className="mt-1 w-full rounded-md border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
