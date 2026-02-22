import { useEffect, useState, useRef } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import styles from './LanguageChart.module.css'

const COLORS = [
  '#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444',
  '#06b6d4', '#f97316', '#ec4899', '#84cc16', '#6366f1',
]

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    const d = payload[0]
    return (
      <div className={styles.tooltip}>
        <span className={styles.dot} style={{ background: d.payload.color }} />
        <span>{d.name}</span>
        <strong>{d.payload.pct}%</strong>
      </div>
    )
  }
  return null
}

export function LanguageChart({ repos, getLanguages, username }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const cache = useRef({})

  useEffect(() => {
    if (!repos.length) return
    let cancelled = false
    setLoading(true)

    const top = repos.slice(0, 12)
    const fetches = top.map(r => {
      const key = `${username}/${r.name}`
      if (cache.current[key]) return Promise.resolve(cache.current[key])
      return getLanguages(username, r.name).then(d => {
        cache.current[key] = d
        return d
      }).catch(() => ({}))
    })

    Promise.all(fetches).then(results => {
      if (cancelled) return
      const totals = {}
      results.forEach(langs => {
        Object.entries(langs).forEach(([lang, bytes]) => {
          totals[lang] = (totals[lang] || 0) + bytes
        })
      })
      const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1])
      const total = sorted.reduce((s, [, v]) => s + v, 0)
      const top10 = sorted.slice(0, 10).map(([name, val], i) => ({
        name,
        value: val,
        pct: Math.round((val / total) * 100),
        color: COLORS[i % COLORS.length],
      }))
      setData(top10)
      setLoading(false)
    })

    return () => { cancelled = true }
  }, [repos, username])

  if (loading) return (
    <div className={styles.card}>
      <h3 className={styles.title}>Lenguajes más usados</h3>
      <div className={styles.loadingGrid}>
        {[1,2,3,4,5].map(i => (
          <div key={i} className={`skeleton ${styles.skRow}`} />
        ))}
      </div>
    </div>
  )

  if (!data.length) return null

  return (
    <div className={`${styles.card} fade-up fade-up-delay-2`}>
      <h3 className={styles.title}>Lenguajes más usados</h3>
      <div className={styles.body}>
        <div className={styles.chart}>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                   paddingAngle={2} dataKey="value">
                {data.map((entry, i) => (
                  <Cell key={entry.name} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <ul className={styles.legend}>
          {data.map(d => (
            <li key={d.name} className={styles.legendItem}>
              <div className={styles.legendLeft}>
                <span className={styles.legendDot} style={{ background: d.color }} />
                <span className={styles.legendName}>{d.name}</span>
              </div>
              <div className={styles.barWrap}>
                <div className={styles.bar} style={{ width: `${d.pct}%`, background: d.color }} />
              </div>
              <span className={styles.legendPct}>{d.pct}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
