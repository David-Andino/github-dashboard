import { useState, useEffect, useCallback } from 'react'
import { useGitHub } from './hooks/useGitHub'
import { Header } from './components/Header'
import { SearchBar } from './components/SearchBar'
import { UserCard } from './components/UserCard'
import { RepoList } from './components/RepoList'
import { CommitPanel } from './components/CommitPanel'
import { LanguageChart } from './components/LanguageChart'
import { TokenModal } from './components/TokenModal'
import { ErrorBanner } from './components/ErrorBanner'
import styles from './App.module.css'

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')
  const [showToken, setShowToken] = useState(false)
  const [user, setUser] = useState(null)
  const [repos, setRepos] = useState([])
  const [selectedRepo, setSelectedRepo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [currentUsername, setCurrentUsername] = useState('')

  const PER_PAGE = 30
  const { token, saveToken, rateLimit, getUser, getRepos, getCommits, getLanguages } = useGitHub()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  const search = useCallback(async (username) => {
    setLoading(true)
    setError(null)
    setUser(null)
    setRepos([])
    setSelectedRepo(null)
    setPage(1)
    setCurrentUsername(username)

    try {
      const [userData, reposData] = await Promise.all([
        getUser(username),
        getRepos(username, 1, PER_PAGE),
      ])
      setUser(userData)
      setRepos(reposData)
      setHasMore(reposData.length === PER_PAGE)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [getUser, getRepos])

  useEffect(() => {
    if (!currentUsername || page === 1) return
    setLoading(true)
    getRepos(currentUsername, page, PER_PAGE)
      .then(data => {
        setRepos(data)
        setHasMore(data.length === PER_PAGE)
        setSelectedRepo(null)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [page])

  return (
    <div className={styles.app}>
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        rateLimit={rateLimit}
        onTokenClick={() => setShowToken(true)}
      />

      <main className={styles.main}>
        <SearchBar onSearch={search} loading={loading && !user} />

        <div className={styles.container}>
          {error && (
            <ErrorBanner message={error} onDismiss={() => setError(null)} />
          )}

          {loading && !user && (
            <div className={styles.loadingState}>
              <div className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
              <span>Buscando en GitHub...</span>
            </div>
          )}

          {user && (
            <div className={styles.content}>
              <div className={styles.sidebar}>
                <div className="fade-up">
                  <UserCard user={user} />
                </div>
                <LanguageChart
                  repos={repos}
                  getLanguages={getLanguages}
                  username={user.login}
                />
              </div>

              <div className={styles.main2}>
                {!token && (
                  <div className={styles.tokenHint}>
                    <span>💡 Agrega un token para aumentar el rate limit de 60 a 5,000 req/h</span>
                    <button onClick={() => setShowToken(true)} className={styles.tokenHintBtn}>
                      Agregar token
                    </button>
                  </div>
                )}

                <RepoList
                  repos={repos}
                  loading={loading}
                  onSelectRepo={r => setSelectedRepo(prev => prev?.id === r.id ? null : r)}
                  selectedRepo={selectedRepo}
                  page={page}
                  setPage={setPage}
                  hasMore={hasMore}
                />

                {selectedRepo && (
                  <CommitPanel
                    repo={selectedRepo}
                    username={user.login}
                    getCommits={getCommits}
                    onClose={() => setSelectedRepo(null)}
                  />
                )}
              </div>
            </div>
          )}

          {!user && !loading && !error && (
            <div className={styles.placeholder}>
              <div className={styles.placeholderIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </div>
              <h3 className={styles.placeholderTitle}>Busca un usuario de GitHub</h3>
              <p className={styles.placeholderSub}>Escribe un nombre de usuario arriba para ver sus repositorios, lenguajes y commits</p>
              <div className={styles.suggestions}>
                {['torvalds', 'gvanrossum', 'sindresorhus', 'tj', 'yyx990803'].map(u => (
                  <button key={u} className={styles.suggestionChip} onClick={() => search(u)}>
                    {u}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {showToken && (
        <TokenModal
          token={token}
          onSave={saveToken}
          onClose={() => setShowToken(false)}
        />
      )}
    </div>
  )
}
