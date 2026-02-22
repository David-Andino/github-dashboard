import { Moon, Sun, Github, Zap } from 'lucide-react'
import styles from './Header.module.css'

export function Header({ theme, toggleTheme, rateLimit, onTokenClick }) {
  const ratePct = rateLimit ? (rateLimit.remaining / rateLimit.limit) * 100 : 100
  const rateColor = ratePct > 50 ? 'var(--green)' : ratePct > 20 ? 'var(--yellow)' : 'var(--red)'
  const resetTime = rateLimit ? new Date(rateLimit.reset).toLocaleTimeString() : null

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <Github size={20} />
          </div>
          <div>
            <span className={styles.name}>GitScope</span>
            <span className={styles.tagline}>Análisis de Repositorios</span>
          </div>
        </div>

        <div className={styles.actions}>
          {rateLimit && (
            <button className={styles.rateBtn} onClick={onTokenClick} title={`Reset: ${resetTime}`}>
              <Zap size={13} style={{ color: rateColor }} />
              <span style={{ color: rateColor }}>{rateLimit.remaining}</span>
              <span className={styles.rateSep}>/</span>
              <span>{rateLimit.limit}</span>
            </button>
          )}

          <button className={styles.tokenBtn} onClick={onTokenClick}>
            Token API
          </button>

          <button className={styles.themeBtn} onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </header>
  )
}
