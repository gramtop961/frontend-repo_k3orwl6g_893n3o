import { useEffect, useRef, useState } from 'react'
import { Music2, Play, Pause, SkipForward, Volume2 } from 'lucide-react'

const tracks = [
  {
    title: 'Deep Focus — Soft Piano',
    url: 'https://cdn.pixabay.com/download/audio/2021/11/02/audio_0d0c9e4f8c.mp3?filename=soft-piano-ambient-110397.mp3',
    length: '3:05',
  },
  {
    title: 'LoFi Beats — Study Flow',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_b0b9069a47.mp3?filename=lofi-study-112191.mp3',
    length: '2:42',
  },
  {
    title: 'Breathing — Calm Waves',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_4e41f1a9e8.mp3?filename=calm-sea-waves-ambient-110874.mp3',
    length: '1:58',
  },
]

export default function MusicPlayer() {
  const [current, setCurrent] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.6)
  const audioRef = useRef(null)

  useEffect(() => {
    if (!audioRef.current) return
    audioRef.current.volume = volume
  }, [volume])

  useEffect(() => {
    if (!audioRef.current) return
    if (isPlaying) audioRef.current.play().catch(() => setIsPlaying(false))
    else audioRef.current.pause()
  }, [isPlaying, current])

  const togglePlay = () => setIsPlaying((p) => !p)
  const next = () => setCurrent((c) => (c + 1) % tracks.length)

  return (
    <div className="w-full h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Music2 className="w-5 h-5 text-sky-600" />
          <h2 className="text-lg font-semibold text-gray-800">Focus Music</h2>
        </div>
        <span className="text-xs text-gray-500">Royalty-free</span>
      </div>

      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <div className="text-sm text-gray-700 font-medium">{tracks[current].title}</div>
        <div className="text-xs text-gray-500">{tracks[current].length}</div>

        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={togglePlay}
            className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-white ${isPlaying ? 'bg-rose-500 hover:bg-rose-600' : 'bg-sky-600 hover:bg-sky-700'}`}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          <button onClick={next} className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700">
            <SkipForward className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <Volume2 className="w-4 h-4 text-gray-500" />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-32"
          />
        </div>

        <audio
          ref={audioRef}
          src={tracks[current].url}
          onEnded={next}
        />
      </div>
    </div>
  )
}
