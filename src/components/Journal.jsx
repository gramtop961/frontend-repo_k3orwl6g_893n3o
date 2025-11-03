import { useEffect, useState } from 'react'
import { Notebook, Sparkles } from 'lucide-react'

const NoteIcon = Notebook

const suggestions = [
  'Apa 3 hal kecil yang berjalan baik hari ini?',
  'Bagian tersulit dari sesi barusan apa, dan bagaimana kamu mengatasinya?',
  'Satu kalimat untuk menggambarkan perasaanmu sekarang.',
  'Apa yang bisa kamu lakukan 1% lebih baik pada sesi berikutnya?',
]

export default function Journal() {
  const [text, setText] = useState('')
  const [savedAt, setSavedAt] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('ff_journal_draft')
    if (saved) setText(saved)
  }, [])

  const save = () => {
    localStorage.setItem('ff_journal_draft', text)
    setSavedAt(new Date().toISOString())
  }

  const suggest = () => {
    const pick = suggestions[Math.floor(Math.random() * suggestions.length)]
    setText((t) => (t ? t + '\n\n' + pick : pick))
  }

  return (
    <div className="w-full h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <NoteIcon className="w-5 h-5 text-violet-600" />
          <h2 className="text-lg font-semibold text-gray-800">AI Journaling</h2>
        </div>
        <button onClick={suggest} className="inline-flex items-center gap-1 text-sm text-violet-700 hover:text-violet-900">
          <Sparkles className="w-4 h-4" />
          Suggest prompt
        </button>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={7}
          placeholder="Bagaimana perasaanmu hari ini? Tulis refleksi singkat di sini..."
          className="w-full resize-none rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        <div className="mt-3 flex items-center justify-between">
          <div className="text-xs text-gray-500">
            {savedAt ? `Saved ${new Date(savedAt).toLocaleTimeString()}` : 'Not saved yet'}
          </div>
          <button onClick={save} className="px-3 py-1.5 text-sm rounded-md bg-violet-600 hover:bg-violet-700 text-white">Save</button>
        </div>
      </div>
      <p className="mt-2 text-xs text-gray-500">Catatan: Fitur AI akan diaktifkan saat koneksi ke backend tersedia.</p>
    </div>
  )
}
