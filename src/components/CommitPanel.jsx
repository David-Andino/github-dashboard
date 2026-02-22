import { useEffect, useState } from 'react'
import { GitCommit, ExternalLink, X } from 'lucide-react'
import styles from './CommitPanel.module.css'

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr)
  const d = Math.floor(diff / 86400000)
  if (d === 0) return 'hoy'
  if (d === 1) return 'ayer'
  if (d < 30) return `hace ${d}d`
  const m = Math.floor(d / 30)
  if (m < 12) return `hace ${m}m`
  return `hace ${Math.floor(m / 12)}a`
}

export function CommitPanel({ repo, username, getCommits, onClose }) {
  const [commits, setCommits] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!repo) return
    setLoading(true)
    setError(null)
    setCommits([])
    getCommits(username, repo.name)
      .then(data => { setCommits(data); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [repo, username])

  return (
    <div className={`${styles.panel} fade-up`}>
      <div className={styles.panelHeader}>
        <div className={styles.panelTitle}>
          <GitCommit size={16} style={{ color: 'var(--accent)' }} />
          <span>Commits recientes en <strong>{repo.name}</strong></span>
        </div>
        <div className={styles.panelActions}>
          <a href={repo.html_url} target="_blank" rel="noreferrer" className={styles.extLink}>
            <ExternalLink size={14} /> Ver en GitHub
          </a>
          <button className={styles.closeBtn} onClick={onClose}><X size={16} /></button>
        </div>
      </div>

      <div className={styles.body}>
        {loading && (
          <div className={styles.loadList}>
            {[1,2,3,4,5].map(i => (
              <div key={i} className={`skeleton ${styles.skCommit}`} />
            ))}
          </div>
        )}
        {error && <div className={styles.error}>{error}</div>}
        {!loading && !error && commits.length === 0 && (
          <div className={styles.empty}>No hay commits disponibles</div>
        )}
        {!loading && commits.map((c, i) => {
          const msg = c.commit.message.split('\n')[0]
          const sha = c.sha.slice(0, 7)
          const author = c.commit.author
          return (
            <a
              key={c.sha}
              href={c.html_url}
              target="_blank"
              rel="noreferrer"
              className={`${styles.commit} fade-up`}
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              <div className={styles.commitLeft}>
                {c.author?.avatar_url && (
                  <img src={c.author.avatar_url} className={styles.avatar} alt="" />
                )}
                <div className={styles.commitInfo}>
                  <span className={styles.message}>{msg}</span>
                  <span className={styles.commitMeta}>
                    {author.name} · {timeAgo(author.date)}
                  </span>
                </div>
              </div>
              <code className={styles.sha}>{sha}</code>
            </a>
          )
        })}
      </div>

      <div className={styles.repoStats}>
        {repo.stargazers_count > 0 && (
          <span className={styles.stat}>⭐ {repo.stargazers_count.toLocaleString()}</span>
        )}
        {repo.forks_count > 0 && (
          <span className={styles.stat}>🍴 {repo.forks_count}</span>
        )}
        {repo.open_issues_count > 0 && (
          <span className={styles.stat}>🐛 {repo.open_issues_count} issues</span>
        )}
        {repo.language && (
          <span className={styles.stat}>📦 {repo.language}</span>
        )}
        {repo.size > 0 && (
          <span className={styles.stat}>💾 {(repo.size / 1024).toFixed(1)} MB</span>
        )}
        {repo.license?.spdx_id && (
          <span className={styles.stat}>📄 {repo.license.spdx_id}</span>
        )}
      </div>
    </div>
  )
}
