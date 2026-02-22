import { useState } from 'react'
import { Star, GitFork, Eye, Clock, Filter, ChevronLeft, ChevronRight } from 'lucide-react'
import styles from './RepoList.module.css'

const LANG_COLORS = {
  JavaScript: '#f7df1e', TypeScript: '#3178c6', Python: '#3572a5',
  Java: '#b07219', 'C++': '#f34b7d', C: '#555555', Go: '#00add8',
  Rust: '#dea584', PHP: '#4f5d95', Ruby: '#701516', Swift: '#fa7343',
  Kotlin: '#a97bff', Dart: '#00b4ab', Shell: '#89e051', HTML: '#e34c26',
  CSS: '#563d7c', Vue: '#41b883', Scala: '#dc322f', Haskell: '#5e5086',
}

function LangDot({ lang }) {
  const color = LANG_COLORS[lang] || 'var(--text-dim)'
  return <span className={styles.langDot} style={{ background: color }} title={lang}>{lang}</span>
}

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

export function RepoList({ repos, loading, onSelectRepo, selectedRepo, page, setPage, hasMore }) {
  const [minStars, setMinStars] = useState(0)
  const [sort, setSort] = useState('updated')

  const filtered = repos
    .filter(r => r.stargazers_count >= minStars)
    .sort((a, b) => {
      if (sort === 'stars') return b.stargazers_count - a.stargazers_count
      if (sort === 'forks') return b.forks_count - a.forks_count
      return new Date(b.updated_at) - new Date(a.updated_at)
    })

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          Repositorios
          {repos.length > 0 && <span className={styles.count}>{filtered.length}</span>}
        </h3>
        <div className={styles.controls}>
          <div className={styles.filterGroup}>
            <Filter size={13} />
            <span>Stars ≥</span>
            <input
              type="number" min="0"
              value={minStars}
              onChange={e => setMinStars(Math.max(0, +e.target.value))}
              className={styles.starsInput}
            />
          </div>
          <select value={sort} onChange={e => setSort(e.target.value)} className={styles.select}>
            <option value="updated">Recientes</option>
            <option value="stars">⭐ Stars</option>
            <option value="forks">🍴 Forks</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className={styles.grid}>
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className={`skeleton ${styles.skCard}`} />
          ))}
        </div>
      ) : (
        <>
          <div className={styles.grid}>
            {filtered.map((repo, i) => (
              <button
                key={repo.id}
                className={`${styles.repoCard} ${selectedRepo?.id === repo.id ? styles.selected : ''} fade-up`}
                style={{ animationDelay: `${i * 0.03}s` }}
                onClick={() => onSelectRepo(repo)}
              >
                <div className={styles.repoTop}>
                  <span className={styles.repoName}>{repo.name}</span>
                  {repo.fork && <span className={styles.badge}>fork</span>}
                  {repo.archived && <span className={`${styles.badge} ${styles.archived}`}>archivado</span>}
                </div>
                {repo.description && (
                  <p className={styles.desc}>{repo.description}</p>
                )}
                <div className={styles.repoMeta}>
                  {repo.language && <LangDot lang={repo.language} />}
                  {repo.stargazers_count > 0 && (
                    <span className={styles.metaItem}>
                      <Star size={12} />{repo.stargazers_count.toLocaleString()}
                    </span>
                  )}
                  {repo.forks_count > 0 && (
                    <span className={styles.metaItem}>
                      <GitFork size={12} />{repo.forks_count}
                    </span>
                  )}
                  <span className={`${styles.metaItem} ${styles.time}`}>
                    <Clock size={12} />{timeAgo(repo.updated_at)}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {filtered.length === 0 && repos.length > 0 && (
            <div className={styles.empty}>No hay repos con ≥ {minStars} ⭐</div>
          )}

          <div className={styles.pagination}>
            <button
              className={styles.pageBtn}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft size={16} /> Anterior
            </button>
            <span className={styles.pageInfo}>Página {page}</span>
            <button
              className={styles.pageBtn}
              onClick={() => setPage(p => p + 1)}
              disabled={!hasMore}
            >
              Siguiente <ChevronRight size={16} />
            </button>
          </div>
        </>
      )}
    </div>
  )
}
