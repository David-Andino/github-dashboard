import { AlertTriangle, X } from 'lucide-react'
import styles from './ErrorBanner.module.css'

export function ErrorBanner({ message, onDismiss }) {
  return (
    <div className={`${styles.banner} fade-up`}>
      <AlertTriangle size={16} />
      <span>{message}</span>
      <button className={styles.dismiss} onClick={onDismiss}><X size={14} /></button>
    </div>
  )
}
