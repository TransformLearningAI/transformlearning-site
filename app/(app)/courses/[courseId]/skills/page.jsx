'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function SkillsReviewPage() {
  const { courseId } = useParams()
  const router = useRouter()
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    fetch(`/api/skills?courseId=${courseId}`)
      .then(r => r.json())
      .then(data => { setSkills(data || []); setLoading(false) })
  }, [courseId])

  function updateSkill(id, field, value) {
    setSkills(skills.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  function removeSkill(id) {
    setSkills(skills.filter(s => s.id !== id))
    fetch(`/api/skills/${id}`, { method: 'DELETE' })
  }

  async function approveAll() {
    setSaving(true)
    await fetch('/api/skills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId, skills }),
    })
    router.push(`/courses/${courseId}`)
  }

  const explicit = skills.filter(s => s.skill_type === 'explicit')
  const implicit = skills.filter(s => s.skill_type === 'implicit')

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-brand-teal border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 text-sm">Loading skill framework…</p>
      </div>
    </div>
  )

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif font-light text-navy" style={{ fontSize: '36px', letterSpacing: '-0.02em' }}>Review Skill Framework</h1>
          <p className="text-gray-500 text-sm mt-1">AI-generated from your syllabus. Edit, remove, or approve as-is.</p>
        </div>
        <button onClick={approveAll} disabled={saving}
          className="px-6 py-3 rounded-xl font-bold text-sm text-white disabled:opacity-60"
          style={{ background: '#4F8A5B' }}>
          {saving ? 'Saving…' : `Approve All & Launch →`}
        </button>
      </div>

      {[
        { type: 'explicit', label: 'Explicit Skills', desc: 'Subject-matter knowledge and procedures your course directly teaches', items: explicit, color: '#00A8A8' },
        { type: 'implicit', label: 'Implicit Skills', desc: 'Transferable cognitive and professional capabilities the course develops', items: implicit, color: '#5A3E6B' },
      ].map(group => (
        <div key={group.type} className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="font-bold text-navy">{group.label}</h2>
            <span className="text-xs font-bold px-2 py-1 rounded-full"
              style={{ background: group.color + '15', color: group.color }}>
              {group.items.length} skills
            </span>
          </div>
          <p className="text-xs text-gray-400 mb-4">{group.desc}</p>

          <div className="space-y-2">
            {group.items.map(skill => (
              <div key={skill.id} className="bg-white border border-gray-200 rounded-xl p-4">
                {editingId === skill.id ? (
                  <div className="space-y-3">
                    <input
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold text-navy focus:outline-none focus:border-brand-teal"
                      value={skill.name}
                      onChange={e => updateSkill(skill.id, 'name', e.target.value)} />
                    <textarea
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:border-brand-teal resize-none"
                      rows={2} value={skill.description || ''}
                      onChange={e => updateSkill(skill.id, 'description', e.target.value)} />
                    <button onClick={() => setEditingId(null)} className="text-xs text-brand-teal font-bold">Done</button>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: group.color }} />
                        <p className="font-semibold text-navy text-sm">{skill.name}</p>
                        {skill.category && (
                          <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{skill.category}</span>
                        )}
                      </div>
                      {skill.description && <p className="text-xs text-gray-500 ml-3.5">{skill.description}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setEditingId(skill.id)} className="text-xs text-gray-400 hover:text-navy">Edit</button>
                      <button onClick={() => removeSkill(skill.id)} className="text-xs text-red-400 hover:text-red-600">Remove</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
