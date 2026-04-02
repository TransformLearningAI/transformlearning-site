'use client'
import { useState } from 'react'

const MOCK_SOURCES = [
  { id: 1, name: 'BSC3096-Fall-2025-Syllabus.pdf', type: 'syllabus', course: 'BSC3096', uploaded: '2025-09-01', size: '245 KB', skills: 12 },
  { id: 2, name: 'Chapter 4 - Cellular Respiration.pdf', type: 'textbook', course: 'BSC3096', uploaded: '2025-09-15', size: '1.2 MB', skills: 3 },
  { id: 3, name: 'Lab Report Template.docx', type: 'template', course: 'BSC3096', uploaded: '2025-09-10', size: '45 KB', skills: 2 },
  { id: 4, name: 'CMET231-Syllabus.pdf', type: 'syllabus', course: 'CMET231', uploaded: '2025-08-28', size: '310 KB', skills: 8 },
]

const TYPE_COLORS = {
  syllabus: { bg: '#EDE9FE', color: '#7C3AED', label: 'Syllabus' },
  textbook: { bg: '#DBEAFE', color: '#2563EB', label: 'Textbook' },
  template: { bg: '#FEF3C7', color: '#D97706', label: 'Template' },
  notes: { bg: '#E8F8F0', color: '#2D8B6F', label: 'Notes' },
  other: { bg: '#F3F4F6', color: '#6B7280', label: 'Other' },
}

const TYPE_ICONS = {
  syllabus: '📋',
  textbook: '📖',
  template: '📝',
  notes: '📒',
  other: '📄',
}

export default function SourceLibraryPage() {
  const [sources] = useState(MOCK_SOURCES)
  const [filter, setFilter] = useState('all')
  const [dragOver, setDragOver] = useState(false)

  const filtered = filter === 'all' ? sources : sources.filter(s => s.type === filter)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-navy">Source Library</h1>
          <p className="text-sm text-gray-400">Course materials, syllabi, and reference documents</p>
        </div>
        <button className="px-4 py-2 rounded-xl text-white text-sm font-bold hover:opacity-90 transition-opacity"
                style={{ background: '#2D8B6F' }}>
          + Add Source
        </button>
      </div>

      {/* Upload zone */}
      <div
        className={`rounded-2xl border-2 border-dashed p-8 text-center mb-6 transition-colors cursor-pointer ${
          dragOver ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-gray-300'
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={() => setDragOver(false)}>
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className="mx-auto mb-3 text-gray-300">
          <path d="M18 6v18M10 14l8-8 8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6 26h24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <p className="text-sm font-medium text-gray-500 mb-1">Drop files here or click to upload</p>
        <p className="text-xs text-gray-400">PDF, DOCX, PPTX up to 10MB</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: 'all', label: 'All Sources' },
          { id: 'syllabus', label: 'Syllabi' },
          { id: 'textbook', label: 'Textbooks' },
          { id: 'template', label: 'Templates' },
          { id: 'notes', label: 'Notes' },
        ].map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
              filter === f.id ? 'text-white' : 'text-gray-500 bg-gray-100 hover:bg-gray-200'
            }`}
            style={filter === f.id ? { background: '#2D8B6F' } : undefined}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Source list */}
      <div className="space-y-3">
        {filtered.map(source => {
          const typeInfo = TYPE_COLORS[source.type] || TYPE_COLORS.other
          return (
            <div key={source.id}
              className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="text-2xl">{TYPE_ICONS[source.type] || '📄'}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-navy truncate">{source.name}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                        style={{ background: typeInfo.bg, color: typeInfo.color }}>
                    {typeInfo.label}
                  </span>
                  <span className="text-[10px] text-gray-400">{source.course}</span>
                  <span className="text-[10px] text-gray-400">{source.size}</span>
                  <span className="text-[10px] text-gray-400">Uploaded {source.uploaded}</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold text-navy">{source.skills}</p>
                <p className="text-[10px] text-gray-400">skills mapped</p>
              </div>
              <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="4" r="1" fill="currentColor"/><circle cx="8" cy="8" r="1" fill="currentColor"/><circle cx="8" cy="12" r="1" fill="currentColor"/>
                </svg>
              </button>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm text-gray-400">No sources found for this filter.</p>
        </div>
      )}

      {/* Governance note */}
      <div className="mt-6 rounded-2xl p-5 flex items-start gap-3" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="mt-0.5 flex-shrink-0">
          <path d="M9 2l6 3v4c0 3.5-2.5 6-6 7-3.5-1-6-3.5-6-7V5l6-3z" stroke="#2D8B6F" strokeWidth="1.3" fill="none"/>
        </svg>
        <div>
          <p className="text-sm font-bold text-navy mb-1">Data Integrity</p>
          <p className="text-xs text-gray-500 leading-relaxed">
            All uploaded sources pass through Arrival's L0 data integrity gate. Content is validated for provenance,
            processed with feature minimization, and linked to governance metadata for full audit traceability.
          </p>
        </div>
      </div>
    </div>
  )
}
