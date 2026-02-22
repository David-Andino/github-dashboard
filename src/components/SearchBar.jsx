import { useState } from 'react'
import { Search } from 'lucide-react'
import styles from './SearchBar.module.css'

export function SearchBar({ onSearch, loading }) {
  const [value, setValue] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const v = value.trim()
    if (v) onSearch(v)
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Analiza cualquier perfil de GitHub</h1>
        <p className={styles.sub}>Repos, commits, lenguajes y métricas en un vistazo</p>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputWrap}>
          <Search size={18} className={styles.icon} />
          <input
            className={styles.input}
            type="text"
            placeholder="Buscar usuario (ej: torvalds, gvanrossum...)"
            value={value}
            onChange={e => setValue(e.target.value)}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <button className={styles.btn} type="submit" disabled={loading || !value.trim()}>
          {loading ? <span className="spinner" /> : 'Analizar'}
        </button>
      </form>
    </div>
  )
}
