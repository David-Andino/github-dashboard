import { useState } from 'react'
import { X, Key, Eye, EyeOff, ExternalLink, Info } from 'lucide-react'
import styles from './TokenModal.module.css'

export function TokenModal({ token, onSave, onClose }) {
  const [value, setValue] = useState(token)
  const [show, setShow] = useState(false)

  const handleSave = () => {
    onSave(value.trim())
    onClose()
  }

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.title}><Key size={16} /> Token de GitHub API</div>
          <button className={styles.close} onClick={onClose}><X size={18} /></button>
        </div>

        <div className={styles.body}>
          <div className={styles.infoBox}>
            <Info size={14} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <p>Sin token: <strong>60 req/hora</strong> · Con token: <strong>5,000 req/hora</strong></p>
              <p>El token se guarda solo en tu navegador (localStorage).</p>
            </div>
          </div>

          <div className={styles.inputWrap}>
            <Key size={15} className={styles.inputIcon} />
            <input
              type={show ? 'text' : 'password'}
              value={value}
              onChange={e => setValue(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              className={styles.input}
              autoComplete="off"
            />
            <button className={styles.eye} onClick={() => setShow(s => !s)}>
              {show ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          <a
            href="https://github.com/settings/tokens/new?scopes=read:user,public_repo"
            target="_blank"
            rel="noreferrer"
            className={styles.link}
          >
            <ExternalLink size={13} /> Crear token en GitHub (scope: public_repo + read:user)
          </a>
        </div>

        <div className={styles.footer}>
          {token && (
            <button className={styles.clearBtn} onClick={() => { onSave(''); onClose() }}>
              Eliminar token
            </button>
          )}
          <div className={styles.footerRight}>
            <button className={styles.cancelBtn} onClick={onClose}>Cancelar</button>
            <button className={styles.saveBtn} onClick={handleSave}>Guardar</button>
          </div>
        </div>
      </div>
    </div>
  )
}
