import { useEffect, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  LineChart, Line, CartesianGrid,
} from 'recharts'

const COLORS = ['#38bdf8', '#818cf8', '#34d399', '#fbbf24', '#f472b6', '#a78bfa', '#fb923c']

export default function App() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('./data/insights.json')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then(setData)
      .catch((e) => setError(e.message))
  }, [])

  if (error) return <div className="app"><p>Could not load insights.json: {error}</p></div>
  if (!data) return <div className="app"><p>Loading…</p></div>

  const { headline, roles, salary_by_role, top_skills, locations, monthly_trend, job_types, frontend_skills, dataset } = data
  const maxSkill = top_skills[0]?.postings ?? 1

  return (
    <div className="app">
      <header>
        <h1>Job Market Insights</h1>
        <p>
          Analysis of {headline.total_postings} tech job postings (sample dataset) -
          Python pipeline + React dashboard.
        </p>
      </header>

      <section className="cards">
        <StatCard label="Postings analyzed" value={headline.total_postings} />
        <StatCard label="Avg salary" value={`${headline.avg_salary_lpa} LPA`} />
        <StatCard label="Remote share" value={`${headline.remote_share_pct}%`} />
        <StatCard label="Distinct roles" value={headline.distinct_roles} />
      </section>

      <div className="grid">
        <section className="panel">
          <h2>Postings by role</h2>
          <p className="sub">Which roles appear most in the dataset</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={roles} layout="vertical" margin={{ left: 60 }}>
              <XAxis type="number" stroke="#94a3b8" fontSize={11} />
              <YAxis type="category" dataKey="role" stroke="#94a3b8" fontSize={11} width={130} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155' }} />
              <Bar dataKey="postings" fill="#38bdf8" radius={[0, 4, 4, 0]} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </section>

        <section className="panel">
          <h2>Average salary by role</h2>
          <p className="sub">Lakhs per annum, from the salary_lpa field</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={salary_by_role} layout="vertical" margin={{ left: 60 }}>
              <XAxis type="number" stroke="#94a3b8" fontSize={11} unit="" />
              <YAxis type="category" dataKey="role" stroke="#94a3b8" fontSize={11} width={130} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155' }} />
              <Bar dataKey="avg_salary_lpa" fill="#34d399" radius={[0, 4, 4, 0]} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </section>

        <section className="panel">
          <h2>Postings over time</h2>
          <p className="sub">Monthly volume across the dataset window</p>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthly_trend}>
              <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155' }} />
              <Line type="monotone" dataKey="postings" stroke="#818cf8" strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </section>

        <section className="panel">
          <h2>Location mix</h2>
          <p className="sub">Where the postings are based</p>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={locations} dataKey="postings" nameKey="location" outerRadius={90} label isAnimationActive={false}>
                {locations.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155' }} />
            </PieChart>
          </ResponsiveContainer>
        </section>

        <section className="panel">
          <h2>Most requested skills</h2>
          <p className="sub">Top skills across all postings</p>
          {top_skills.slice(0, 10).map((s) => (
            <div className="skill-row" key={s.skill}>
              <span className="name">{s.skill}</span>
              <span className="bar" style={{ width: `${(s.postings / maxSkill) * 100}%` }} />
              <span className="n">{s.postings}</span>
            </div>
          ))}
        </section>

        <section className="panel">
          <h2>Frontend role deep-dive</h2>
          <p className="sub">Skills requested for Frontend Developer postings</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={frontend_skills}>
              <XAxis dataKey="skill" stroke="#94a3b8" fontSize={11} angle={-20} textAnchor="end" height={60} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155' }} />
              <Bar dataKey="postings" fill="#f472b6" radius={[4, 4, 0, 0]} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </section>

        <section className="panel">
          <h2>Job type split</h2>
          <p className="sub">Full-time vs internship vs contract</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={job_types} dataKey="postings" nameKey="type" outerRadius={80} label isAnimationActive={false}>
                {job_types.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155' }} />
            </PieChart>
          </ResponsiveContainer>
        </section>
      </div>

      <footer>
        Data: {dataset.name} ({dataset.note}). Analysis: analysis/analyze.py. Frontend: React + Recharts + Vite.
      </footer>
    </div>
  )
}

function StatCard({ label, value }) {
  return (
    <div className="card">
      <div className="label">{label}</div>
      <div className="value">{value}</div>
    </div>
  )
}
